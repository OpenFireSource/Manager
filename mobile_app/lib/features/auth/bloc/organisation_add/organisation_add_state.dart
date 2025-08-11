import 'package:equatable/equatable.dart';

enum OrganisationAddServerState { untouched, loading, valid, invalid }

enum OrganisationAddNameState { untouched, valid, invalid }

class OrganisationAddState extends Equatable {
  final String name;
  final String server;
  final OrganisationAddNameState nameValid;
  final OrganisationAddServerState serverState;
  final bool submitted;
  final String organisationId;

  const OrganisationAddState({
    required this.name,
    required this.server,
    required this.nameValid,
    required this.serverState,
    required this.submitted,
    required this.organisationId,
  });

  OrganisationAddState.copyWith(
    OrganisationAddState old, {
    String? name,
    String? server,
    OrganisationAddNameState? nameValid,
    OrganisationAddServerState? serverState,
    bool? submitted,
    String? organisationId,
  }) : name = name ?? old.name,
       server = server ?? old.server,
       nameValid = nameValid ?? old.nameValid,
       serverState = serverState ?? old.serverState,
       submitted = submitted ?? old.submitted,
       organisationId = organisationId ?? old.organisationId;

  @override
  List<Object?> get props => [
    name,
    server,
    nameValid,
    serverState,
    submitted,
    organisationId,
  ];
}
