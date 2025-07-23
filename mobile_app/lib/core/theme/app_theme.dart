import 'package:flutter/material.dart';

class AppColors {
  static const primary = Color(0xFF2255A4);
  static const secondary = Color(0xFFFFA726);
  static const background = Color(0xFFF4F4F4);

  static const error = Colors.redAccent;
}

class AppTextStyles {
  static const heading = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: AppColors.primary,
  );

  static const body = TextStyle(
    fontSize: 16,
    color: Colors.black87,
  );
}

class AppTheme {
  static final ThemeData light = ThemeData(
    brightness: Brightness.light,
    primaryColor: AppColors.primary,
    colorScheme: ColorScheme.light(
      primary: AppColors.primary,
      secondary: AppColors.secondary,
      surface: AppColors.background,
      error: AppColors.error,
    ),
    scaffoldBackgroundColor: AppColors.background,
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.primary,
      foregroundColor: Colors.white,
    ),
    textTheme: const TextTheme(
      titleLarge: AppTextStyles.heading,
      bodyMedium: AppTextStyles.body,
    ),
    // TODO IconTheme, ButtonTheme, InputDecorationTheme etc.
  );

  static final ThemeData dark = ThemeData(
    brightness: Brightness.dark,
    primaryColor: AppColors.primary,
    colorScheme: ColorScheme.dark(
      primary: AppColors.primary,
      secondary: AppColors.secondary,
      surface: Colors.black,
      error: AppColors.error,
    ),
    scaffoldBackgroundColor: Colors.black,
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.primary,
      foregroundColor: Colors.white,
    ),
    textTheme: const TextTheme(
      titleLarge: AppTextStyles.heading,
      bodyMedium: AppTextStyles.body,
    ),
  );
}