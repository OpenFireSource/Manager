import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_event.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_state.dart';
import 'package:mobile_app/features/auth/bloc/login/login_bloc.dart';
import 'package:mobile_app/features/auth/bloc/login/login_event.dart';
import 'package:mobile_app/features/auth/bloc/login/login_state.dart';

class LoginScreen extends StatelessWidget {
  LoginScreen({super.key});

  final TextEditingController _controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => LoginBloc(appAuth: const FlutterAppAuth()),
      child: BlocConsumer<LoginBloc, LoginState>(
        listener: (ctx, state) {
          if (state.accessToken != null && state.refreshToken != null) {
            ctx.read<OrganisationBloc>().add(
              OrganisationLoginEvent(state.accessToken!, state.refreshToken!),
            );
          }
        },
        builder: (context, state) => BlocConsumer<LoginBloc, LoginState>(
            listenWhen: (previous, current) =>
                previous.error != current.error && current.error != null,
            listener: (ctx, state) {
              if (state.error != null) {
                ScaffoldMessenger.of(
                  ctx,
                ).showSnackBar(SnackBar(content: Text(state.error!)));
              }
            },
            builder: (context, state) {
              _controller.value = _controller.value.copyWith(
                text: state.serverUrl,
              );
              return Scaffold(
                appBar: AppBar(title: const Text("Login")),
                body: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: ListView(
                    children: [
                      BlocBuilder<OrganisationBloc, OrganisationState>(
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
                          child: Text('Remove'),
                        ),
                      ),
                      TextField(
                        controller: _controller,
                        decoration: const InputDecoration(
                          labelText: 'Server-URL eingeben',
                        ),
                        enabled: !state.isBusy,
                        onChanged: (val) => context.read<LoginBloc>().add(
                          LoginServerUrlChanged(val),
                        ),
                      ),
                      const SizedBox(height: 20),
                      Center(
                        child: ElevatedButton(
                          onPressed: state.isBusy
                              ? null
                              : () => context.read<LoginBloc>().add(
                                  LoginSubmitted(),
                                ),
                          child: state.isBusy
                              ? const CircularProgressIndicator()
                              : const Text("An Organisation anmelden"),
                        ),
                      ),
                      const SizedBox(height: 20),
                      _TokenTile(
                        tokenName: "Access-Token",
                        token: state.accessToken,
                      ),
                      _TokenTile(
                        tokenName: "Refresh-Token",
                        token: state.refreshToken,
                      ),
                      _TokenTile(tokenName: "Id-Token", token: state.idToken),
                    ],
                  ),
                ),
              );
            },
          ),
      ),
    );
  }
}

class _TokenTile extends StatelessWidget {
  final String tokenName;
  final String? token;

  const _TokenTile({required this.tokenName, required this.token});

  @override
  Widget build(BuildContext context) {
    return Text(
      '$tokenName: ${token != null ? (token!.length > 30 ? '${token!.substring(0, 30)}...' : token!) : 'kein $tokenName'}',
      softWrap: true,
    );
  }
}
