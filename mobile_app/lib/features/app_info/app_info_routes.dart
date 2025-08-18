import 'package:go_router/go_router.dart';
import 'package:mobile_app/features/app_info/presentation/screens/imprint_screen.dart';
import 'package:mobile_app/features/app_info/presentation/screens/license_screen.dart';
import 'package:mobile_app/shared/transitions/app_fade_transition.dart';

final appInfoImprintScreen = '/appInfo/imprint';
final appInfoLicenseScreen = '/appInfo/license';

final List<GoRoute> appInfoRoutes = [
  GoRoute(
    path: appInfoImprintScreen,
    pageBuilder: (context, state) => CustomTransitionPage(
      key: state.pageKey,
      child: const ImprintScreen(),
      transitionsBuilder: appFadeTransition,
    ),
  ),
  GoRoute(
    path: appInfoLicenseScreen,
    pageBuilder: (context, state) => CustomTransitionPage(
      key: state.pageKey,
      child: const LicenseScreen(),
      transitionsBuilder: appFadeTransition,
    ),
  ),
];
