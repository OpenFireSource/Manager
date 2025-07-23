import 'package:go_router/go_router.dart';
import 'package:mobile_app/shared/transitions/app_fade_transition.dart';
import 'package:mobile_app/features/auth/presentation/screens/login_screen.dart';

final List<GoRoute> authRoutes = [
  GoRoute(
    path: '/auth/login',
    pageBuilder: (context, state) => CustomTransitionPage(
      key: state.pageKey,
      child: const LoginScreen(),
      transitionsBuilder: appFadeTransition,
    ),
  ),
];
