import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_event.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_state.dart';
import 'package:mobile_app/core/data/repositories/authentication_repo.dart';
import 'package:mobile_app/features/auth/bloc/login/login_bloc.dart';
import 'package:mobile_app/features/auth/bloc/login/login_event.dart';
import 'package:mobile_app/features/auth/bloc/login/login_state.dart';

class LoginScreen extends StatelessWidget {
  LoginScreen({super.key});

  final TextEditingController _controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => LoginBloc(
        appAuth: const FlutterAppAuth(),
        authenticationRepo: context.read<AuthenticationRepo>(),
      ),
      child: BlocListener<LoginBloc, LoginState>(
        listener: (ctx, state) {
          if (state.accessToken != null && state.refreshToken != null) {
            ctx.read<OrganisationBloc>().add(
              OrganisationLoginEvent(state.accessToken!, state.refreshToken!),
            );
          }
        },
        child: Scaffold(
          appBar: AppBar(title: const Text("Login")),
          body: Stack(
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    SizedBox(height: MediaQuery.of(context).size.height * 0.05),
                    BlocBuilder<OrganisationBloc, OrganisationState>(
                      builder: (context, state) =>
                          state is OrganisationSelectedState
                          ? Text(
                              'Jetzt muss du Dich nur noch bei ${state.selectedOrganisation.name} anmelden',
                              textAlign: TextAlign.center,
                            )
                          : SizedBox(),
                    ),
                    const SizedBox(height: 20),
                    Center(
                      child: BlocConsumer<LoginBloc, LoginState>(
                        listenWhen: (previous, current) =>
                            previous.error != current.error &&
                            current.error != null,
                        listener: (ctx, state) {
                          if (state.error != null) {
                            ScaffoldMessenger.of(ctx).showSnackBar(
                              SnackBar(content: Text(state.error!)),
                            );
                          }
                        },
                        builder: (context, loginState) =>
                            BlocBuilder<OrganisationBloc, OrganisationState>(
                              buildWhen: (previous, current) =>
                                  current is OrganisationSelectedState,
                              builder: (context, organisationState) {
                                return ElevatedButton(
                                  onPressed: loginState.isBusy
                                      ? null
                                      : () => context.read<LoginBloc>().add(
                                          LoginSubmitted(
                                            (organisationState
                                                    as OrganisationSelectedState)
                                                .selectedOrganisation
                                                .serverUrl,
                                          ),
                                        ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      loginState.isBusy
                                          ? const Padding(
                                              padding: EdgeInsets.all(12.0),
                                              child: SizedBox(
                                                width: 16,
                                                height: 16,
                                                child:
                                                    CircularProgressIndicator(
                                                      strokeWidth: 2,
                                                    ),
                                              ),
                                            )
                                          : const SizedBox(),
                                      const Text("An Organisation anmelden"),
                                    ],
                                  ),
                                );
                              },
                            ),
                      ),
                    ),
                  ],
                ),
              ),
              Positioned(
                left: 5,
                top: 5,
                child: BlocBuilder<OrganisationBloc, OrganisationState>(
                  buildWhen: (previous, current) =>
                      current is OrganisationSelectedState,
                  builder: (context, state) => TextButton(
                    onPressed: () => context.read<OrganisationBloc>().add(
                      OrganisationRemoveEvent(
                        (state as OrganisationSelectedState)
                            .selectedOrganisation
                            .id,
                      ),
                    ),
                    child: const Text('Abbrechen'),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
