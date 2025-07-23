import 'package:go_router/go_router.dart';
import 'package:mobile_app/core/presentation/screens/not_found.dart';
import 'package:mobile_app/features/app_info/app_info_routes.dart';
import 'package:mobile_app/features/auth/auth_routes.dart';
import 'package:mobile_app/features/home/home_routes.dart';
import 'package:mobile_app/features/onboarding/onboarding_routes.dart';
import 'package:mobile_app/features/splash/splash_routes.dart';
import 'package:mobile_app/shared/transitions/app_fade_transition.dart';

class AppRouter {
  static final router = GoRouter(
    initialLocation: '/splash',
    routes: [
      ...homeRoutes,
      ...splashRoutes,
      ...onboardingRoutes,
      ...authRoutes,
      ...appInfoRoutes,
    ],
    errorPageBuilder: (context, state) => CustomTransitionPage(
      key: state.pageKey,
      child: NotFoundScreen(),
      transitionsBuilder: appFadeTransition,
    ),
  );
}
