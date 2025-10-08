import 'package:go_router/go_router.dart';
import 'package:mobile_app/features/home/presentation/screens/home_screen.dart';
import 'package:mobile_app/shared/transitions/app_fade_transition.dart';

const String homeScreen = '/';

final List<GoRoute> homeRoutes = [
  GoRoute(
    path: homeScreen,
    pageBuilder: (context, state) => CustomTransitionPage(
      key: state.pageKey,
      child: const HomeScreen(),
      transitionsBuilder: appFadeTransition,
    ),
  ),
];
