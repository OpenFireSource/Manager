import 'package:go_router/go_router.dart';
import 'package:mobile_app/features/onboarding/presentation/screens/onboarding_screen.dart';
import 'package:mobile_app/shared/transitions/app_fade_transition.dart';

const String onboardingScreen = '/onboarding';

final List<GoRoute> onboardingRoutes = [
  GoRoute(
    path: onboardingScreen,
    pageBuilder: (context, state) => CustomTransitionPage(
      key: state.pageKey,
      child: const OnboardingScreen(),
      transitionsBuilder: appFadeTransition,
    ),
  ),
];
