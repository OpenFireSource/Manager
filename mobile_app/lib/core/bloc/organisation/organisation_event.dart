import 'package:equatable/equatable.dart';

abstract class OrganisationEvent extends Equatable {
  const OrganisationEvent();

  @override
  List<Object?> get props => [];
}

class OrganisationLoadEvent extends OrganisationEvent {
  const OrganisationLoadEvent();
}

class OrganisationSelectedEvent extends OrganisationEvent {
  final String id;

  const OrganisationSelectedEvent({required this.id});

  @override
  List<Object?> get props => [id];
}

class OrganisationNewEvent extends OrganisationEvent {
  final String name;
  final String serverUrl;

  const OrganisationNewEvent({required this.name, required this.serverUrl});

  @override
  List<Object?> get props => [name, serverUrl];
}

class OrganisationRemoveEvent extends OrganisationEvent {
  final String id;

  const OrganisationRemoveEvent(this.id);

  @override
  List<Object?> get props => [id];
}

class OrganisationLoginEvent extends OrganisationEvent {
  final String accessToken;
  final String refreshToken;

  const OrganisationLoginEvent(this.accessToken, this.refreshToken);

  @override
  List<Object?> get props => [accessToken, refreshToken];
}

class OrganisationLogoutEvent extends OrganisationEvent {
  final String organisationId;

  const OrganisationLogoutEvent(this.organisationId);

  @override
  List<Object?> get props => [organisationId];
}

class OrganisationRolesUpdateEvent extends OrganisationEvent {
  final String organisationId;
  final List<String>? roles;

  const OrganisationRolesUpdateEvent(this.organisationId, this.roles);

  @override
  List<Object?> get props => [organisationId, roles];
}
