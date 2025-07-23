import 'package:go_router/go_router.dart';
import 'package:mobile_app/features/splash/presentation/screens/splash_screen.dart';
import 'package:mobile_app/shared/transitions/app_fade_transition.dart';

final List<GoRoute> splashRoutes = [
  GoRoute(
    path: '/splash',
    // builder: (context, state) => const SplashScreen(),
    pageBuilder: (context, state) => CustomTransitionPage(
      key: state.pageKey,
      child: const SplashScreen(),
      transitionsBuilder: appFadeTransition,
    ),
  ),
];
