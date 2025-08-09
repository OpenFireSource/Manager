import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_event.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_state.dart';
import 'package:mobile_app/core/data/models/organisation_model.dart';
import 'package:mobile_app/core/data/repositories/authentication_repo.dart';
import 'package:mobile_app/core/data/repositories/organisation_repo.dart';
import 'package:mobile_app/core/utils/debug.dart';
import 'package:mobile_app/features/auth/auth_routes.dart';
import 'package:mobile_app/routes/app_router.dart';
import 'package:mobile_app/core/theme/app_theme.dart';

import 'core/data/repositories/storage_repo.dart';
import 'features/home/home_routes.dart';
import 'features/onboarding/onboarding_routes.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return _buildProvider(
      context,
      MaterialApp.router(
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        darkTheme: AppTheme.dark,
        routerConfig: AppRouter.router,
        title: 'Manager',
        locale: const Locale('de'),
        builder: (ctx1, child) => MultiBlocListener(
          listeners: [
            BlocListener<OrganisationBloc, OrganisationState>(
              listener: (ctx, state) {
                if (state is OrganisationSelectedState) {
                  debug(
                    'Number of Organisations: ${state.organisations.length}; Selected id: ${state.selectedOrganisation.id}; loginStatus: ${state.selectedOrganisation.loginStatus}',
                  );
                  if (state.selectedOrganisation.loginStatus ==
                      LoginStatus.loggedout) {
                    AppRouter.router.go(loginScreen);
                  } else {
                    AppRouter.router.go(homeScreen);
                  }
                } else if (state is OrganisationEmptyState) {
                  debug('Empty organisation list. Navigating to /onboarding');
                  AppRouter.router.go(onboardingScreen);
                }
              },
            ),
          ],
          child: child ?? SizedBox(),
        ),
      ),
    );
  }

  Widget _buildProvider(BuildContext context, Widget child) {
    return MultiRepositoryProvider(
      providers: [
        RepositoryProvider(create: (_) => StorageRepo()),
        RepositoryProvider(
          create: (BuildContext ctx) =>
              OrganisationRepo(storageRepo: ctx.read<StorageRepo>()),
        ),
        RepositoryProvider(
          create: (BuildContext ctx) =>
              AuthenticationRepo(storageRepo: ctx.read<StorageRepo>()),
        ),
      ],
      child: MultiBlocProvider(
        providers: [
          BlocProvider<OrganisationBloc>(
            create: (BuildContext ctx) => OrganisationBloc(
              ctx.read<OrganisationRepo>(),
              ctx.read<AuthenticationRepo>(),
            )..add(OrganisationLoadEvent()),
          ),
        ],
        child: child,
      ),
    );
  }
}
