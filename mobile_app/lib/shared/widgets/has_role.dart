import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_bloc.dart';
import 'package:mobile_app/core/bloc/organisation/organisation_state.dart';

class HasRole extends StatelessWidget {
  final Set<String> roles;
  final Widget child;
  final Widget? alternative;

  HasRole({
    super.key,
    String? role,
    List<String>? roles,
    required this.child,
    this.alternative,
  }) : assert(role != null || roles != null),
       roles = (roles ?? [role!]).toSet();

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<OrganisationBloc, OrganisationState>(
      builder: (context, state) =>
          state is OrganisationSelectedState &&
              state.roles != null &&
              state.roles!.toSet().intersection(roles.toSet()).isNotEmpty
          ? child
          : (alternative ?? Container()),
    );
  }
}
