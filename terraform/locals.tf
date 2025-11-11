locals {

# Naming conventions:  <Resource Type> - <Project Name> -> <environment> > <region>
  resource_name = "${var.project_name}-${var.environment}-${var.region}"

  common_tags = {
    environment = var.environment_tag
    project     = "${var.resource_name_prefix}-ui"
    creator     = "Created by Terraform"
  }
}