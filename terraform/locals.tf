locals {

# Naming conventions: {serviceType}-{appName}-{optional:componentName}-{environment}-{location}
  resource_name      = "${var.project_name}-${var.environment}-${var.location_abbr}"
  web_materials_name = "${var.project_name}-web-${var.environment}-${var.location_abbr}"
  
  common_tags = {
    environment = var.environment_tag
    project     = "${var.project_name}-ui"
    creator     = "Created by Terraform"
  }
}