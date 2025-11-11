# global config lookup
data "azuread_client_config" "current" {}

# vnet lookup
data "azurerm_virtual_network" "polaris_vnet" {
  name                = var.vnet_name
  resource_group_name = var.vnet_rg
}

# To reference a specific subnet use data.azurerm_subnet.materials_subnets["<subnet-name>"].id
data "azurerm_subnet" "materials_subnets" {
  for_each             = toset(data.azurerm_virtual_network.polaris_vnet.subnets)
  name                 = each.value
  virtual_network_name = var.vnet_name
  resource_group_name  = var.vnet_rg
}

# private dns zone lookup
data "azurerm_private_dns_zone" "hub_dns_zones" {
  for_each            = var.private_dns_zones
  name                = each.value
  resource_group_name = var.vnet_rg
}