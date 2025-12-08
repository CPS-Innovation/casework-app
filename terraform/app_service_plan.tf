#################### App Service Plan ####################
resource "azurerm_service_plan" "web_linux" {
  #checkov:skip=CKV_AZURE_212:Ensure App Service has a minimum number of instances for failover
  #checkov:skip=CKV_AZURE_225:Ensure the App Service Plan is zone redundant
  #checkov:skip=CKV_AZURE_211:Ensure App Service plan suitable for production use
  name                      = "asp-${local.resource_name}"
  resource_group_name       = azurerm_resource_group.rg_materials.name
  location                  = azurerm_resource_group.rg_materials.location
  os_type                   = "Linux"
  sku_name                  = var.web_asp_materials.sku
  zone_balancing_enabled    = startswith(var.web_asp_materials.sku, "B") ? false : var.web_asp_materials.zone_balancing_enabled
  worker_count              = var.web_asp_materials.worker_count   
  tags                      = local.common_tags
}

resource "azurerm_monitor_autoscale_setting" "amas_materials_web" {
  name                = "amas-${azurerm_service_plan.web_linux.name}"
  resource_group_name = azurerm_resource_group.rg_materials.name
  location            = azurerm_resource_group.rg_materials.location
  target_resource_id  = azurerm_service_plan.web_linux.id
  enabled             = true
  tags                = local.common_tags
  profile {
    name = "Case Materials Web Performance Scaling Profile"
    capacity {
      default = var.web_asp_materials.autoscale_default
      minimum = var.web_asp_materials.autoscale_minimum
      maximum = var.web_asp_materials.autoscale_maximum
    }
    rule {
      metric_trigger {
        metric_name        = "CpuPercentage"
        metric_resource_id = azurerm_service_plan.web_linux.id
        time_grain         = "PT1M"
        statistic          = "Average"
        time_window        = "PT5M"
        time_aggregation   = "Average"
        operator           = "GreaterThan"
        threshold          = 80
      }
      scale_action {
        direction = "Increase"
        type      = "ChangeCount"
        value     = "1"
        cooldown  = "PT1M"
      }
    }
    rule {
      metric_trigger {
        metric_name        = "CpuPercentage"
        metric_resource_id = azurerm_service_plan.web_linux.id
        time_grain         = "PT1M"
        statistic          = "Average"
        time_window        = "PT5M"
        time_aggregation   = "Average"
        operator           = "LessThan"
        threshold          = 50
      }
      scale_action {
        direction = "Decrease"
        type      = "ChangeCount"
        value     = "1"
        cooldown  = "PT1M"
      }
    }
  }
}
