import 'package:flutter/material.dart';

Widget appFadeTransition(
  BuildContext context,
  Animation<double> animation,
  Animation<double> secondaryAnimation,
  Widget child,
) => FadeTransition(
  opacity: CurveTween(curve: Curves.easeInOutCirc).animate(animation),
  child: child,
);
