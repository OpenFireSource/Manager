import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile_app/features/auth/auth_routes.dart';
import 'package:mobile_app/features/onboarding/presentation/widgets/onboarding_page_1.dart';
import 'package:mobile_app/features/onboarding/presentation/widgets/onboarding_page_2.dart';
import 'package:mobile_app/features/onboarding/presentation/widgets/onboarding_page_3.dart';
import 'package:mobile_app/shared/widgets/page_indicator.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<StatefulWidget> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  final List<Widget> _pages = [
    OnboardingPage1(),
    OnboardingPage2(),
    OnboardingPage3(),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _nextPage() {
    if (_currentIndex < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeIn,
      );
    } else {
      context.go(addOrganisationScreen);
    }
  }

  void _skip() {
    context.go(addOrganisationScreen);
  }

  void _onNextPage(index) {
    setState(() => _currentIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Align(
              alignment: Alignment.topRight,
              child: TextButton(
                onPressed: _skip,
                child: const Text('Überspringen'),
              ),
            ),
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                itemCount: _pages.length,
                onPageChanged: _onNextPage,
                itemBuilder: (context, index) => _pages[_currentIndex],
              ),
            ),
            PageIndicator(currentPage: _currentIndex, pageCount: _pages.length),
            const SizedBox(height: 15),
            Padding(
              padding: const EdgeInsets.symmetric(),
              child: TextButton(
                onPressed: _nextPage,
                child: Text(
                  _currentIndex == _pages.length - 1 ? 'Start' : 'Weiter',
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
