#####################################################
# The below code can be used to declare a specific TLS Cipher in Azure App Service.
# Commenting out for now as we are currently running TLS 1.3 in App Service so there is no need to declare a specific cipher.
# If compatability issues arrise, the below code can be used to downgrade to 1.2 and use a specific cipher. 
#####################################################

# locals {
#   web_function_apps = {
#       web_materials_ui          = azurerm_linux_web_app.as_web_materials.id
#       web_materials_ui_staging1 = azurerm_linux_web_app_slot.as_web_materials_staging1.id
#       web_materials_components  = azurerm_linux_web_app.as_comp_materials.id
#     }
# }

# data "azapi_resource_id" "web_function_apps" {
#   for_each  = local.web_function_apps
#   type      = contains(split("_", each.key), "staging1") ? "Microsoft.Web/sites/slots/config@2024-11-01" : "Microsoft.Web/sites/config@2024-11-01"
#   parent_id = each.value
#   name      = "web"
# }

# resource "azapi_resource_action" "set_min_tls_cipher_suite" {
#   for_each    = local.web_function_apps
#   type        = contains(split("_", each.key), "staging1") ? "Microsoft.Web/sites/slots/config@2024-11-01" : "Microsoft.Web/sites/config@2024-11-01"
#   resource_id = data.azapi_resource_id.web_function_apps[each.key].id
#   method      = "PUT"
#   body = {
#     name = data.azapi_resource_id.web_function_apps[each.key].name
#     properties = {
#       minTlsCipherSuite = "TLS_AES_128_GCM_SHA256"
#     }
#   }
#   response_export_values = {
#     id                = "$.id"
#     name              = "$.name"
#     type              = "$.type"
#     minTlsCipherSuite = "$.properties.minTlsCipherSuite"
#   }
# }