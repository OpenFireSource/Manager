export interface ConsumableGroupDto {
  id: number;
  name: string;
  notice?: string;
}

export interface ConsumableGroupCreateDto {
  name: string;
  notice?: string;
}

export interface ConsumableGroupUpdateDto {
  name?: string;
  notice?: string;
}

export interface ConsumableDto {
  id: number;
  name?: string;
  notice?: string;
  quantity: number;
  expirationDate?: Date;
  groupId?: number;
  group?: ConsumableGroupDto;
  locationId?: number;
  location?: any; // LocationDto - will be imported later
}

export interface ConsumableCreateDto {
  name?: string;
  notice?: string;
  quantity: number;
  expirationDate?: Date;
  groupId?: number;
  locationId?: number;
}

export interface ConsumableUpdateDto {
  name?: string;
  notice?: string;
  quantity?: number;
  expirationDate?: Date;
  groupId?: number;
  locationId?: number;
}

export interface CountDto {
  count: number;
}