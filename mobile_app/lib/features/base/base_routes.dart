import 'package:go_router/go_router.dart';
import 'package:mobile_app/features/base/presentation/screens/locations_screen.dart';
import 'package:mobile_app/shared/transitions/app_fade_transition.dart';

final locationsScreen = '/base/locations';

locationsScreenDetail(int id) => '/base/locations/$id';

final List<GoRoute> baseRoutes = [
  GoRoute(
    path: locationsScreen,
    pageBuilder: (context, state) => CustomTransitionPage(
      key: state.pageKey,
      child: LocationsScreen(),
      transitionsBuilder: appFadeTransition,
    ),
  ),
];
