import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_event.dart';
import 'package:mobile_app/core/data/repositories/authentication_repo.dart';
import 'package:mobile_app/core/data/repositories/organisation_repo.dart';
import 'package:mobile_app/features/auth/bloc/organisation_add/organisation_add_bloc.dart';
import 'package:mobile_app/features/auth/bloc/organisation_add/organisation_add_event.dart';
import 'package:mobile_app/features/auth/bloc/organisation_add/organisation_add_state.dart';

class OrganisationAddScreen extends StatelessWidget {
  const OrganisationAddScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (ctx) => OrganisationAddBloc(
        organisationRepo: ctx.read<OrganisationRepo>(),
        authenticationRepo: ctx.read<AuthenticationRepo>(),
      ),
      child: BlocListener<OrganisationAddBloc, OrganisationAddState>(
        listener: (ctx, state) {
          if (state.submitted) {
            // TODO reload Organisations and select Organisation.
            ctx.read<OrganisationBloc>().add(
              OrganisationSelectedEvent(id: state.organisationId),
            );
          }
        },
        child: Scaffold(
          appBar: AppBar(title: const Text("Account hinzufügen")),
          body: Padding(
            padding: const EdgeInsets.all(16.0),
            child: ListView(
              children: [
                BlocBuilder<OrganisationAddBloc, OrganisationAddState>(
                  builder: (context, state) => TextFormField(
                    decoration: InputDecoration(
                      labelText: 'Name',
                      errorText:
                          state.nameValid == OrganisationAddNameState.invalid
                          ? 'Name ist erforderlich (max. 30 Zeichen)'
                          : null,
                      suffixIcon:
                          state.nameValid == OrganisationAddNameState.valid
                          ? Icon(Icons.check, color: Colors.green)
                          : null,
                    ),
                    onChanged: (value) => context
                        .read<OrganisationAddBloc>()
                        .add(OrganisationAddUpdateNameEvent(value)),
                  ),
                ),
                BlocBuilder<OrganisationAddBloc, OrganisationAddState>(
                  builder: (context, state) => TextFormField(
                    decoration: InputDecoration(
                      labelText: 'Server',
                      errorText:
                          state.serverState ==
                              OrganisationAddServerState.invalid
                          ? 'Server ist erforderlich'
                          : null,
                      suffixIcon:
                          state.serverState == OrganisationAddServerState.valid
                          ? Icon(Icons.check, color: Colors.green)
                          : state.serverState ==
                                OrganisationAddServerState.loading
                          ? Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: SizedBox(
                                width: 16,
                                height: 16,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              ),
                            )
                          : null,
                    ),
                    onChanged: (value) => context
                        .read<OrganisationAddBloc>()
                        .add(OrganisationAddUpdateServerEvent(value)),
                  ),
                ),
                SizedBox(height: 20),
                BlocBuilder<OrganisationAddBloc, OrganisationAddState>(
                  builder: (context, state) => ElevatedButton(
                    onPressed:
                        state.nameValid == OrganisationAddNameState.valid &&
                            state.serverState ==
                                OrganisationAddServerState.valid
                        ? () => context.read<OrganisationAddBloc>().add(
                            OrganisationAddSubmitServerEvent(),
                          )
                        : null,
                    child: Text('Account hinzufügen'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
