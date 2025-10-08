import 'package:equatable/equatable.dart';
import 'package:mobile_app/core/data/models/organisation_model.dart';

abstract class OrganisationState extends Equatable {
  @override
  List<Object?> get props => [];

  const OrganisationState();
}

class OrganisationInitialState extends OrganisationState {
  const OrganisationInitialState();
}

class OrganisationEmptyState extends OrganisationState {}

class OrganisationSelectedState extends OrganisationState {
  final Map<String, OrganisationModel> organisations;
  final OrganisationModel selectedOrganisation;
  final DateTime updateTime;
  final List<String>? roles;

  OrganisationSelectedState({
    required this.organisations,
    required this.selectedOrganisation,
    this.roles,
  }) : updateTime = DateTime.now();

  @override
  List<Object?> get props => [updateTime, organisations, selectedOrganisation];
}
