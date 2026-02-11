#################### Functions #####################
# Ensure Minimum Tls Cipher Suite is set to TLS_AES_128_GCM_SHA256 
# WORKAROUND - to be done directly in the azurerm_linux_web_app resource once supported
# See the following links for more information
# https://github.com/hashicorp/terraform-provider-azurerm/issues/24223
# https://github.com/Azure/terraform-provider-azapi/issues/557
#####################################################

## Function Apps: 
locals {
  web_function_apps = {
      web_materials_ui          = azurerm_linux_web_app.as_web_materials.id
      web_materials_ui_staging1 = azurerm_linux_web_app_slot.as_web_materials_staging1.id
      web_materials_components  = azurerm_linux_web_app.as_web_materials.id
    }
}

data "azapi_resource_id" "web_function_apps" {
  for_each  = local.web_function_apps
  type      = contains(split("_", each.key), "staging1") ? "Microsoft.Web/sites/slots/config@2024-11-01" : "Microsoft.Web/sites/config@2024-11-01"
  parent_id = each.value
  name      = "web"
}

resource "azapi_resource_action" "set_min_tls_cipher_suite" {
  for_each    = local.web_function_apps
  type        = contains(split("_", each.key), "staging1") ? "Microsoft.Web/sites/slots/config@2024-11-01" : "Microsoft.Web/sites/config@2024-11-01"
  resource_id = data.azapi_resource_id.web_function_apps[each.key].id
  method      = "PUT"
  body = {
    name = data.azapi_resource_id.web_function_apps[each.key].name
    properties = {
      minTlsCipherSuite = "TLS_AES_128_GCM_SHA256"
    }
  }
  response_export_values = {
    id                = "$.id"
    name              = "$.name"
    type              = "$.type"
    minTlsCipherSuite = "$.properties.minTlsCipherSuite"
  }
}