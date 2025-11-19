environment     = "qa"
environment_tag = "qa"
location        = "UK South"
location_abbr   = "uks"
project_name    = "materials"

dns_server      = "10.8.0.6"

vnet_name       = "vnet-innovation-qa"
vnet_rg         = "rg-networking"
app_subnet_name = "polaris-apps-subnet"
ui_subnet_name  = "polaris-ui-subnet"
as_web_pe_ip    = null # initially set to null, will be changed once IP auto assigned
as_comp_pe_ip   = null

private_dns_zones = {
  blob        = "privatelink.blob.core.windows.net"
  file        = "privatelink.file.core.windows.net"
  table       = "privatelink.table.core.windows.net"
  queue       = "privatelink.queue.core.windows.net"
  sites       = "privatelink.azurewebsites.net"
  vault       = "privatelink.vaultcore.azure.net"
  cognitive   = "privatelink.cognitiveservices.azure.com"
  search      = "privatelink.search.windows.net"
}

web_asp_materials = {
  sku                     = "B2"
  worker_count            = "1"
  zone_balancing_enabled  = false
  autoscale_default       = 2
  autoscale_minimum       = 1
  autoscale_maximum       = 4
}

app_reg_owners = ["49a53165-9fa6-4f51-bebe-90ed1cc2e58f", "2cd0a11e-402b-4562-998c-2376d61bbb7f", "2b1e4713-81db-45cb-918c-c3bb5a5b72e5"]
terraform_service_principal_display_name = "Azure Pipeline: Innovation-QA"
fa_polaris_gateway_name = "fa-polaris-qa-gateway-appreg"