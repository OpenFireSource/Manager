import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_event.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_state.dart';
import 'package:mobile_app/core/data/models/organisation_model.dart';
import 'package:mobile_app/core/data/repositories/authentication_repo.dart';
import 'package:mobile_app/core/data/repositories/organisation_repo.dart';
import 'package:mobile_app/core/utils/debug.dart';

class OrganisationBloc extends Bloc<OrganisationEvent, OrganisationState> {
  final OrganisationRepo _organisationRepo;
  final AuthenticationRepo _authenticationRepo;

  OrganisationBloc(this._organisationRepo, this._authenticationRepo)
    : super(const OrganisationInitialState()) {
    _authenticationRepo.registerOrganisationBloc(this);
    on<OrganisationLoadEvent>(_onOrganisationLoad);
    on<OrganisationSelectedEvent>(_onOrganisationSelect);
    on<OrganisationRemoveEvent>(_onOrganisationRemove);
    on<OrganisationLoginEvent>(_onOrganisationLogin);
    on<OrganisationLogoutEvent>(_onOrganisationLogout);
    on<OrganisationRolesUpdateEvent>(_onOrganisationRolesUpdated);
  }

  Future<void> _onOrganisationLoad(
    OrganisationLoadEvent event,
    Emitter<OrganisationState> emit,
  ) async {
    var organisations = await _organisationRepo.load();
    if (organisations.isEmpty) {
      emit(OrganisationEmptyState());
      return;
    }
    await _authenticationRepo.load(organisations.values.toList());

    var selectedOrgId = await _organisationRepo.getSelectedOrganisation();

    OrganisationModel selectedOrg;

    if (organisations.containsKey(selectedOrgId)) {
      selectedOrg = organisations[selectedOrgId]!;
    } else {
      selectedOrg = organisations[organisations.keys.first]!;
      await _organisationRepo.setSelectedOrganisation(selectedOrg.id);
    }

    emit(
      OrganisationSelectedState(
        organisations: organisations,
        selectedOrganisation: selectedOrg,
        roles: _authenticationRepo.getRoles(selectedOrg.id),
      ),
    );
  }

  void _onOrganisationSelect(
    OrganisationSelectedEvent event,
    Emitter<OrganisationState> emit,
  ) async {
    if (state is OrganisationInitialState) {
      add(OrganisationLoadEvent());
      return;
    }

    var organisations = _organisationRepo.organisations;
    if (!organisations.containsKey(event.id)) {
      // TODO eventuell Fehler anzeigen
      debug(
        'Fehler beim Auswählen der Organisation. Organisation wurde nicht gefunden.',
      );
      return;
    }

    _organisationRepo.setSelectedOrganisation(event.id);
    emit(
      OrganisationSelectedState(
        organisations: organisations,
        selectedOrganisation: organisations[event.id]!,
        roles: _authenticationRepo.getRoles(event.id),
      ),
    );
  }

  void _onOrganisationRemove(
    OrganisationRemoveEvent event,
    Emitter<OrganisationState> emit,
  ) async {
    if (state is! OrganisationSelectedState) {
      add(OrganisationLoadEvent());
      return;
    }

    // TODO logic in repo auslagern und über exceptions Fehler behandeln.
    var organisations = _organisationRepo.organisations;
    if (!organisations.containsKey(event.id)) {
      // TODO eventuell Fehler anzeigen
      return;
    }

    organisations = await _organisationRepo.remove(event.id);
    if ((state as OrganisationSelectedState).selectedOrganisation.id ==
        event.id) {
      if (organisations.isEmpty) {
        emit(OrganisationEmptyState());
      } else {
        add(OrganisationSelectedEvent(id: organisations.keys.first));
      }
    } else {
      emit(
        OrganisationSelectedState(
          organisations: organisations,
          selectedOrganisation:
              (state as OrganisationSelectedState).selectedOrganisation,
          roles: (state as OrganisationSelectedState).roles,
        ),
      );
    }
  }

  void _onOrganisationLogin(
    OrganisationLoginEvent event,
    Emitter<OrganisationState> emit,
  ) async {
    if (state is! OrganisationSelectedState) {
      return;
    }

    final currentState = state as OrganisationSelectedState;
    final selectedOrganisation = currentState.selectedOrganisation;
    await _authenticationRepo.saveLoginData(
      selectedOrganisation,
      event.accessToken,
      event.refreshToken,
    );

    emit(
      OrganisationSelectedState(
        organisations: currentState.organisations,
        selectedOrganisation: currentState.selectedOrganisation,
        roles: _authenticationRepo.getRoles(currentState.selectedOrganisation.id),
      ),
    );
  }

  _onOrganisationLogout(
    OrganisationLogoutEvent event,
    Emitter<OrganisationState> emit,
  ) async {
    if (state is! OrganisationSelectedState) {
      return;
    }

    final currentState = state as OrganisationSelectedState;
    final organisations = currentState.organisations;

    final relevantOrganisation = organisations.containsKey(event.organisationId)
        ? organisations[event.organisationId]
        : null;

    await _authenticationRepo.clearCredentials(event.organisationId);

    relevantOrganisation?.loginStatus = LoginStatus.loggedout;

    emit(
      OrganisationSelectedState(
        organisations: currentState.organisations,
        selectedOrganisation: currentState.selectedOrganisation,
      ),
    );
  }

  void _onOrganisationRolesUpdated(
    OrganisationRolesUpdateEvent event,
    Emitter<OrganisationState> emit,
  ) {
    if (state is! OrganisationSelectedState) {
      return;
    }

    final currentState = state as OrganisationSelectedState;
    if (currentState.selectedOrganisation.id == event.organisationId) {
      emit(
        OrganisationSelectedState(
          organisations: currentState.organisations,
          selectedOrganisation: currentState.selectedOrganisation,
          roles: event.roles,
        ),
      );
    }
  }
}
