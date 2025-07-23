import 'package:go_router/go_router.dart';
import 'package:mobile_app/features/onboarding/presentation/screens/onboarding_screen.dart';
import 'package:mobile_app/shared/transitions/app_fade_transition.dart';

final List<GoRoute> onboardingRoutes = [
  GoRoute(
    path: '/onboarding',
    // builder: (context, state) => const SplashScreen(),
    pageBuilder: (context, state) => CustomTransitionPage(
      key: state.pageKey,
      child: const OnboardingScreen(),
      transitionsBuilder: appFadeTransition,
    ),
  ),
];
