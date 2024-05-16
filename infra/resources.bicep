param name string = 'azurechat-demo'
param resourceToken string

param location string = resourceGroup().location

@secure()
param nextAuthHash string = uniqueString(newGuid())

@secure()
param githubToken string

param useTestData bool

param githubAccountType string

param githubAccountName string

param tags object = {}

var cosmos_name = toLower('${name}-cosmos-${resourceToken}')
var webapp_name = toLower('${name}-webapp-${resourceToken}')
var stg_name = toLower('${name}stg${resourceToken}')
var functionapp_name = toLower('${name}-fcnapp-${resourceToken}')
var appservice_name = toLower('${name}-app-${resourceToken}')

// keyvault name must be less than 24 chars - token is 13
var kv_prefix = take(name, 7)
var keyVaultName = toLower('${kv_prefix}-kv-${resourceToken}')
var la_workspace_name = toLower('${name}-la-${resourceToken}')
var appinsights_name = toLower('${name}-appi-${resourceToken}')
var diagnostic_setting_name = 'AppServiceConsoleLogs'

var keyVaultSecretsOfficerRole = subscriptionResourceId(
  'Microsoft.Authorization/roleDefinitions',
  'b86a8fe4-44ce-4948-aee5-eccb2c155cd7'
)
var storageDataWriterRole = subscriptionResourceId(
  'Microsoft.Authorization/roleDefinitions',
  'ba92f5b4-2d11-453d-a403-e96b0029c9fe'
)

var databaseName = 'platform-engineering'
var orgContainerName = 'history'

resource appServicePlan 'Microsoft.Web/serverfarms@2020-06-01' = {
  name: appservice_name
  location: location
  tags: tags
  properties: {
    reserved: true
  }
  sku: {
    name: 'P0v3'
    tier: 'Premium0V3'
    size: 'P0v3'
    family: 'Pv3'
    capacity: 1
  }
  kind: 'linux'
}

resource copilotDataFunction 'Microsoft.Web/sites@2023-12-01' = {
  name: functionapp_name
  tags: union(tags, { 'azd-service-name': 'ingestion' })
  kind: 'functionapp'
  identity: { type: 'SystemAssigned' }
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      alwaysOn: true
      linuxFxVersion: 'DOTNET-ISOLATED|8.0'
      appSettings: [
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
        {
          name: 'AzureWebJobsStorage__accountname'
          value: storage.name
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'dotnet-isolated'
        }
        {
          name: 'AZURE_COSMOSDB_CONNECTION_STRING'
          value: '@Microsoft.KeyVault(VaultName=${kv.name};SecretName=${kv::AZURE_COSMOSDB_CONNECTION_STRING.name})'
        }
        {
          name: 'GITHUB_TOKEN'
          value: '@Microsoft.KeyVault(VaultName=${kv.name};SecretName=${kv::GITHUB_TOKEN.name})'
        }
        {
          name: 'USE_TEST_DATA'
          value: string(useTestData)
        }
        {
          name: 'GITHUB_TYPE'
          value: githubAccountType
        }
        {
          name: 'GITHUB_NAME'
          value: githubAccountName
        }
      ]
    }
  }
}

resource webApp 'Microsoft.Web/sites@2020-06-01' = {
  name: webapp_name
  location: location
  tags: union(tags, { 'azd-service-name': 'frontend' })
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'node|20-lts'
      alwaysOn: true
      appCommandLine: 'next start'
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      appSettings: [
        {
          name: 'AZURE_KEY_VAULT_NAME'
          value: keyVaultName
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'true'
        }
        {
          name: 'NEXTAUTH_SECRET'
          value: '@Microsoft.KeyVault(VaultName=${kv.name};SecretName=${kv::NEXTAUTH_SECRET.name})'
        }
        {
          name: 'NEXTAUTH_URL'
          value: 'https://${webapp_name}.azurewebsites.net'
        }
        {
          name: 'GITHUB_FUNCTION_URI'
          value: 'https://${copilotDataFunction.properties.defaultHostName}/'
        }
        {
          name: 'GITHUB_FUNCTION_CODE'
          value: '@Microsoft.KeyVault(VaultName=${kv.name};SecretName=${kv::GITHUB_FUNCTION_CODE.name})'
        }
        {
          name: 'AZURE_COSMOSDB_URI'
          value: cosmosDbAccount.properties.documentEndpoint
        }
        {
          name: 'AZURE_COSMOSDB_KEY'
          value: '@Microsoft.KeyVault(VaultName=${kv.name};SecretName=${kv::AZURE_COSMOSDB_KEY.name})'
        }
      ]
    }
  }
  identity: { type: 'SystemAssigned' }

  resource configLogs 'config' = {
    name: 'logs'
    properties: {
      applicationLogs: { fileSystem: { level: 'Verbose' } }
      detailedErrorMessages: { enabled: true }
      failedRequestsTracing: { enabled: true }
      httpLogs: { fileSystem: { enabled: true, retentionInDays: 1, retentionInMb: 35 } }
    }
  }
}

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2021-12-01-preview' = {
  name: la_workspace_name
  location: location
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appinsights_name
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    RetentionInDays: 30
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
}

resource webDiagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: diagnostic_setting_name
  scope: webApp
  properties: {
    workspaceId: logAnalyticsWorkspace.id
    logs: [
      {
        category: 'AppServiceConsoleLogs'
        enabled: true
      }
    ]
    metrics: []
  }
}

resource kvFunctionAppPermissions 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(kv.id, copilotDataFunction.name, keyVaultSecretsOfficerRole)
  scope: kv
  properties: {
    principalId: copilotDataFunction.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: keyVaultSecretsOfficerRole
  }
}

resource kvWebAppPermissions 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(kv.id, webApp.name, keyVaultSecretsOfficerRole)
  scope: kv
  properties: {
    principalId: webApp.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: keyVaultSecretsOfficerRole
  }
}

resource kv 'Microsoft.KeyVault/vaults@2021-06-01-preview' = {
  name: keyVaultName
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enabledForDeployment: false
    enabledForDiskEncryption: true
    enabledForTemplateDeployment: false
  }

  resource NEXTAUTH_SECRET 'secrets' = {
    name: 'NEXTAUTH-SECRET'
    properties: {
      contentType: 'text/plain'
      value: nextAuthHash
    }
  }

  resource AZURE_COSMOSDB_KEY 'secrets' = {
    name: 'AZURE-COSMOSDB-KEY'
    properties: {
      contentType: 'text/plain'
      value: cosmosDbAccount.listKeys().secondaryMasterKey
    }
  }

  resource AZURE_COSMOSDB_CONNECTION_STRING 'secrets' = {
    name: 'AZURE-COSMOSDB-CONNECTION-STRING'
    properties: {
      contentType: 'text/plain'
      value: cosmosDbAccount.listConnectionStrings().connectionStrings[0].connectionString
    }
  }

  resource GITHUB_FUNCTION_CODE 'secrets' = {
    name: 'GITHUB-FUNCTION-CODE'
    properties: {
      contentType: 'text/plain'
      value: listKeys('${copilotDataFunction.id}/host/default', '2023-12-01').functionKeys.default
    }
  }

  resource GITHUB_TOKEN 'secrets' = {
    name: 'GITHUB-TOKEN'
    properties: {
      contentType: 'text/plain'
      value: githubToken
    }
  }
}

resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: cosmos_name
  location: location
  tags: tags
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
        failoverPriority: 0
      }
    ]
    disableKeyBasedMetadataWriteAccess: true
  }
}

resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2022-05-15' = {
  name: databaseName
  parent: cosmosDbAccount
  properties: {
    resource: {
      id: databaseName
    }
  }
}

resource historyContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2022-05-15' = {
  name: orgContainerName
  parent: database
  properties: {
    resource: {
      id: orgContainerName
      partitionKey: {
        paths: [
          '/Month'
        ]
        kind: 'Hash'
      }
    }
  }
}

resource storage 'Microsoft.Storage/storageAccounts@2023-04-01' = {
  name: stg_name
  kind: 'StorageV2'
  sku: { name: 'Standard_LRS' }
  location: location
  properties: {
    allowBlobPublicAccess: false
  }
}

resource storageDataContributor 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storage.id, copilotDataFunction.name, 'DataContributor')
  scope: storage
  properties: {
    principalId: copilotDataFunction.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: storageDataWriterRole
  }
}

output url string = 'https://${webApp.properties.defaultHostName}'
