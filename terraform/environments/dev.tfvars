environment   = "dev"
location      = "UK South"
project_name  = "materials"


#### TBC  #####
dns_server  = "10.8.0.6"

vnet_name       = "vnet-innovation-development"
vnet_rg         = "rg-networking"
app_subnet_name = "polaris-apps-subnet"
ui_subnet_name  = "polaris-ui-subnet"

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