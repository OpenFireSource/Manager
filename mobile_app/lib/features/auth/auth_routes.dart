import 'package:go_router/go_router.dart';
import 'package:mobile_app/features/auth/presentation/screens/organisation_add_screen.dart';
import 'package:mobile_app/shared/transitions/app_fade_transition.dart';
import 'package:mobile_app/features/auth/presentation/screens/login_screen.dart';

final loginScreen = '/auth/login';
final addOrganisationScreen = '/auth/addOrganisation';

final List<GoRoute> authRoutes = [
  GoRoute(
    path: loginScreen,
    pageBuilder: (context, state) => CustomTransitionPage(
      key: state.pageKey,
      child: LoginScreen(),
      transitionsBuilder: appFadeTransition,
    ),
  ),
  GoRoute(
    path: addOrganisationScreen,
    pageBuilder: (context, state) => CustomTransitionPage(
      key: state.pageKey,
      child: OrganisationAddScreen(),
      transitionsBuilder: appFadeTransition,
    ),
  ),
];
