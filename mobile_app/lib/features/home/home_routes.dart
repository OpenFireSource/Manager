import 'package:go_router/go_router.dart';
import 'package:mobile_app/features/home/presentation/screens/home_screen.dart';

const String homeScreen = '/';

final List<GoRoute> homeRoutes = [
  GoRoute(path: homeScreen, builder: (context, state) => const HomeScreen()),
];
