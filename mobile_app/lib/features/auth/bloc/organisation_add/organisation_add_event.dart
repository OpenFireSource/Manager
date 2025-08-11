import 'package:equatable/equatable.dart';

abstract class OrganisationAddEvent extends Equatable {
  const OrganisationAddEvent();

  @override
  List<Object?> get props => [];
}

class OrganisationAddResetEvent extends OrganisationAddEvent {
  const OrganisationAddResetEvent();
}

class OrganisationAddUpdateNameEvent extends OrganisationAddEvent {
  final String name;

  const OrganisationAddUpdateNameEvent(this.name);

  @override
  List<Object?> get props => [name];
}

class OrganisationAddUpdateServerEvent extends OrganisationAddEvent {
  final String server;

  const OrganisationAddUpdateServerEvent(this.server);

  @override
  List<Object?> get props => [server];
}

class OrganisationAddSubmitServerEvent extends OrganisationAddEvent {
  const OrganisationAddSubmitServerEvent();
}
