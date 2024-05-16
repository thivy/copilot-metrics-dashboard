targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the the environment which is used to generate a short unique hash used in all resources.')
param name string

@minLength(1)
@description('Primary location for all resources')
param location string

@secure()
@description('PAT to call Github API')
param githubToken string

@description('Type of Github account (organisation or enterprise)')
@allowed([
  'organisation'
  'enterprise'
])
param githubAccountType string

@description('Name of Githubn organisation or enterprise')
param githubAccountName string

@description('True to use test data, false to use real data')
param useTestData bool

param resourceGroupName string = ''

var resourceToken = toLower(uniqueString(subscription().id, name, location))
var tags = { 'azd-env-name': name }

// Organize resources in a resource group
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: !empty(resourceGroupName) ? resourceGroupName : 'rg-${name}'
  location: location
  tags: tags
}

module resources 'resources.bicep' = {
  name: 'all-resources'
  scope: rg
  params: {
    name: name
    resourceToken: resourceToken
    tags: tags
    location: location
    useTestData: useTestData
    githubToken: githubToken
    githubAccountType: githubAccountType
    githubAccountName: githubAccountName
  }
}

output APP_URL string = resources.outputs.url
output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
