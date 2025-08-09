import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_event.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_state.dart';
import 'package:mobile_app/core/data/models/organisation_model.dart';
import 'package:mobile_app/core/data/repositories/authentication_repo.dart';
import 'package:mobile_app/core/data/repositories/organisation_repo.dart';
import 'package:mobile_app/core/utils/debug.dart';
import 'package:uuid/uuid.dart';

class OrganisationBloc extends Bloc<OrganisationEvent, OrganisationState> {
  final OrganisationRepo _organisationRepo;
  final AuthenticationRepo _authenticationRepo;

  OrganisationBloc(this._organisationRepo, this._authenticationRepo)
    : super(const OrganisationInitialState()) {
    _authenticationRepo.registerOrganisationBloc(this);
    on<OrganisationLoadEvent>(_onOrganisationLoad);
    on<OrganisationSelectedEvent>(_onOrganisationSelect);
    on<OrganisationAddEvent>(_onOrganisationAdd);
    on<OrganisationRemoveEvent>(_onOrganisationRemove);
    on<OrganisationLoginEvent>(_onOrganisationLogin);
    on<OrganisationLogoutEvent>(_onOrganisationLogout);
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

    emit(OrganisationSelectedState(organisations, selectedOrg));
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
    emit(OrganisationSelectedState(organisations, organisations[event.id]!));
  }

  void _onOrganisationAdd(
    OrganisationAddEvent event,
    Emitter<OrganisationState> emit,
  ) async {
    if (state is OrganisationInitialState) {
      add(OrganisationLoadEvent());
      return;
    }

    // TODO handle errors
    final id = Uuid().v4();
    var priority = 1;

    var organisations = _organisationRepo.organisations;
    var priorities = organisations.values.map((x) => x.priority).toSet();
    while (priorities.contains(priority)) {
      priority++;
    }

    final newOrganisation = OrganisationModel(
      id,
      event.name,
      event.serverUrl,
      priority,
      loginStatus: LoginStatus.loggedout,
    );
    organisations = await _organisationRepo.add(newOrganisation);

    add(OrganisationSelectedEvent(id: newOrganisation.id));
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
          organisations,
          (state as OrganisationSelectedState).selectedOrganisation,
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
        currentState.organisations,
        currentState.selectedOrganisation,
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
        currentState.organisations,
        currentState.selectedOrganisation,
      ),
    );
  }
}
