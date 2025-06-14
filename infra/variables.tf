variable "aws_region" {
  description = "AWS region to deploy into"
  default     = "us-east-1"
}
variable "aws_az" {
  description = "AWS availability zone to deploy into"
  default     = "us-east-1a"
}

variable "instance_type" {
  description = "Type of EC2 instance"
  default     = "t2.micro"
}

variable "ami_id" {
  description = "AMI ID for the instance"
  default     = "ami-09e6f87a47903347c"
}
