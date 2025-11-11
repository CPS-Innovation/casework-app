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


## UI ##
variable "web_asp_materials" {
  type = object({
    sku     = string
    worker_count           = string
    zone_balancing_enabled = string
  })
}