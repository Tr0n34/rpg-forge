package com.rpgforge.application.policies;

import com.rpgforge.api.common.BadRequestException;

public final class Policies {

    private Policies() {
        throw new UnsupportedOperationException("Policy factory");
    }

    public static <T> Rule<T> rule(String errorKey, Policy<T> policy) {
        return new Rule<>(errorKey, policy);
    }

    @SafeVarargs
    public static <T> Policy<T> allOf(Policy<T>... policies) {
        return target -> {
            for (Policy<T> policy : policies) {
                policy.ensure(target);
            }
        };
    }

    public static <T> Policy<T> forOperation(String targetName, String operation, Policy<T> policy) {
        return new OperationPolicy<>(targetName, operation, policy);
    }

    public static void require(boolean condition, String errorKey) {
        if (!condition) {
            throw new BadRequestException(errorKey);
        }
    }

    private record OperationPolicy<T>(
            String targetName,
            String operation,
            Policy<T> delegate
    ) implements Policy<T> {

        @Override
        public void ensure(T target) {
            delegate.ensure(target);
        }
    }
}
