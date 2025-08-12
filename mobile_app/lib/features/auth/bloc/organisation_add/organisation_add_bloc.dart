import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_app/core/data/models/organisation_model.dart';
import 'package:mobile_app/core/data/repositories/authentication_repo.dart';
import 'package:mobile_app/core/data/repositories/organisation_repo.dart';
import 'package:mobile_app/features/auth/bloc/organisation_add/organisation_add_event.dart';
import 'package:mobile_app/features/auth/bloc/organisation_add/organisation_add_state.dart';
import 'package:uuid/uuid.dart';

class OrganisationAddBloc
    extends Bloc<OrganisationAddEvent, OrganisationAddState> {
  final OrganisationRepo _organisationRepo;
  final AuthenticationRepo _authenticationRepo;

  int _lastRequest = 0;
  CancelToken? _previous;

  OrganisationAddBloc({
    required OrganisationRepo organisationRepo,
    required AuthenticationRepo authenticationRepo,
  }) : _organisationRepo = organisationRepo,
       _authenticationRepo = authenticationRepo,
       super(
         const OrganisationAddState(
           name: '',
           server: '',
           nameValid: OrganisationAddNameState.untouched,
           serverState: OrganisationAddServerState.untouched,
           submitted: false,
           organisationId: '',
         ),
       ) {
    on<OrganisationAddResetEvent>(_onOrganisationAddReset);
    on<OrganisationAddUpdateNameEvent>(_onOrganisationAddUpdateNameEvent);
    on<OrganisationAddUpdateServerEvent>(_onOrganisationAddUpdateServerEvent);
    on<OrganisationAddSubmitServerEvent>(_onOrganisationAddSubmitServerEvent);
  }

  _onOrganisationAddReset(
    OrganisationAddResetEvent event,
    Emitter<OrganisationAddState> emit,
  ) {
    emit(
      const OrganisationAddState(
        name: '',
        server: '',
        nameValid: OrganisationAddNameState.untouched,
        serverState: OrganisationAddServerState.untouched,
        submitted: false,
        organisationId: '',
      ),
    );
  }

  _onOrganisationAddUpdateNameEvent(
    OrganisationAddUpdateNameEvent event,
    Emitter<OrganisationAddState> emit,
  ) {
    final nameValid = _checkName(event.name);
    emit(
      OrganisationAddState.copyWith(
        state,
        name: event.name,
        nameValid: nameValid
            ? OrganisationAddNameState.valid
            : OrganisationAddNameState.invalid,
      ),
    );
  }

  _onOrganisationAddUpdateServerEvent(
    OrganisationAddUpdateServerEvent event,
    Emitter<OrganisationAddState> emit,
  ) async {
    emit(
      OrganisationAddState.copyWith(
        state,
        server: event.server,
        serverState: OrganisationAddServerState.loading,
      ),
    );

    final requestId = ++_lastRequest;
    await Future.delayed(Duration(milliseconds: 500));
    if (requestId != _lastRequest) return;

    final serverValid = await _checkServer(event.server);
    // nur die letzte Anfrage berücksichtigen
    if (requestId == _lastRequest) {
      emit(
        OrganisationAddState.copyWith(
          state,
          serverState: serverValid
              ? OrganisationAddServerState.valid
              : OrganisationAddServerState.invalid,
        ),
      );
    }
  }

  _onOrganisationAddSubmitServerEvent(
    OrganisationAddSubmitServerEvent event,
    Emitter<OrganisationAddState> emit,
  ) async {
    if (state.submitted ||
        state.serverState != OrganisationAddServerState.valid ||
        state.nameValid != OrganisationAddNameState.valid) {
      return;
    }

    final id = Uuid().v4();
    var priority = 1;

    var organisations = _organisationRepo.organisations;
    var priorities = organisations.values.map((x) => x.priority).toSet();
    while (priorities.contains(priority)) {
      priority++;
    }

    final newOrganisation = OrganisationModel(
      id,
      state.name,
      state.server,
      priority,
      loginStatus: LoginStatus.loggedout,
    );
    organisations = await _organisationRepo.add(newOrganisation);

    emit(
      OrganisationAddState.copyWith(state, submitted: true, organisationId: id),
    );
  }

  bool _checkName(String name) => name.isNotEmpty && name.length < 30;

  Future<bool> _checkServer(String serverBasePath) async {
    try {
      _previous?.cancel();
      _previous = CancelToken();
      final response = await _authenticationRepo.getServerInfo(serverBasePath);
      return response != null;
    } catch (e) {
      return false;
    }
  }
}
