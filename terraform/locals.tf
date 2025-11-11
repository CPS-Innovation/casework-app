locals {

# Naming conventions:  <Resource Type> - <Project Name> -> <environment> > <region>
  resource_name = "${var.project_name}-${var.environment}-${var.location_abbr}"

  common_tags = {
    environment = var.environment_tag
    project     = "${var.project_name}-ui"
    creator     = "Created by Terraform"
  }
}