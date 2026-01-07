## Global ##
variable "project_name" {
  description = "The project name of this resource"
  type    = string
}

variable "environment" {
  description = "The environment of this resource"
  type = string
}

variable "location" {
  description = "The location of this resource"
  type        = string
}

variable "resource_name_prefix" {
  type    = string
  default = "polaris"
}

variable "location_abbr" {
  description = "The abbreviated located of this resource"
  type        = string
}

variable "environment_tag" {
  type        = string
  description = "Environment tag value"
}

variable "terraform_service_principal_display_name" {
  type = string
  description = "Name of the service principal responsible for running Terraform"
}

## Networking ##
variable "private_dns_zones" {
  type        = map(string)
  description = "A map of private dns zones"
}

variable "vnet_name" {
  type        = string
  description = "The name of the virtual network"
}

variable "vnet_rg" {
  type        = string
  description = "The name of the resource group containing the VNet."
}

variable "app_subnet_name" {
  type = string
}

variable "ui_subnet_name" {
  type = string
}

variable "dns_server" {
  type        = string
  description = "The name of the DNS server"
}

variable "as_web_pe_ip" {
  type        = string
  description = "A static private IP address to use for the Materials UI private endpoint."
  default     = null
}

variable "as_web_pe_ip_staging" {
  type        = string
  description = "A static private IP address to use for the Materials UI private endpoint Staging Slot."
  default     = null
}

variable "as_comp_pe_ip" {
  type        = string
  description = "A static private IP address to use for the Materials UI private endpoint."
  default     = null
}

## UI ##
variable "web_asp_materials" {
  type = object({
    sku     = string
    worker_count           = string
    zone_balancing_enabled = string
    autoscale_default      = string
    autoscale_minimum      = string
    autoscale_maximum      = string 
  })
}

variable "app_reg_owners" {
  description = "List of object IDs for users with owner permissions to App Registrations we are creating during this build "
  type        = list(string)
  default     = []
}

# Lookups
variable "fa_polaris_gateway_name" {
  type        = string
  description = "The name of the polaris function app backend."
  default     = null
}


variable "materials_ui_sub_folder" {
  type = string
  // this value must match the PUBLIC_URL=... value
  //  as seen in the ui project top-level package.json
  //  scripts section.
  default = "materials-ui"
}