# GitHub Copilot Metrics - Dashboard

# Introduction

The GitHub Copilot Metrics Dashboard is a solution accelerator designed to visualize metrics from GitHub Copilot using the [GitHub Copilot Metrics API](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28) and [GitHub Copilot User Management API](https://docs.github.com/en/rest/copilot/copilot-user-management?apiVersion=2022-11-28).

![GitHub Copilot Metrics - Dashboard](/docs/dashboard.jpeg "GitHub Copilot Metrics - Dashboard")

The dashboard showcases a range of features:

#### 🌟 Filters

Ability to filter metrics by date range, languages, code editors and visualise data by time frame (daily, weekly, monthly).

#### 🌟 Acceptance Average

Percentage of suggestions accepted by users for given date range and group by time range (daily, weekly, monthly).

#### 🌟 Active Users

Number of active users for the last cycle.

#### 🌟 Adoption Rate

Number of active users who are using GitHub Copilot in relation to the total number of licensed users.

#### 🌟 Seat Information

Number of active, inactive, and total users.

#### 🌟 Language

Breakdown of languages which can be used to filter the data.

#### 🌟 Code Editors

Breakdown of code editors which can be used to filter the data.

# Deploy to Azure

You can provision Azure resources for the solution accelerator using either the Azure Developer CLI or clone the repository and setup the provided GitHub Actions.

> [!IMPORTANT] 🔐
> Regardless of the method you chose you will still need to setup [authentication](https://learn.microsoft.com/en-us/azure/app-service/overview-authentication-authorization) using the built-in authentication and authorization capabilities of Azure App Service.

This section will create Azure resources and deploy the solution from your local environment using the Azure Developer CLI. Note that you do not need to clone this repo to complete these steps.

1. Download the [Azure Developer CLI](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/overview)
1. If you have not cloned this repo, run `azd init -t microsoft/copilot-metrics-dashboard`. If you have cloned this repo, just run 'azd init' from the repo root directory.
1. Run `azd up` to provision and deploy the application

```pwsh
azd init -t microsoft/copilot-metrics-dashboard
azd up

# if you are wanting to see logs run with debug flag
azd up --debug
```

> [!IMPORTANT] 🔐
> The dashboard must be protected by an identity provider and follow the steps in [Add an identity provider](/docs/5-add-identity.md) section for adding authentication to your app.

# Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
