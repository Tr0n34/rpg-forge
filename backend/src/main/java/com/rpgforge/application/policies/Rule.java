package com.rpgforge.application.policies;

public record Rule<T>(
        String errorKey,
        Policy<T> policy
) implements Policy<T> {

    @Override
    public void ensure(T target) {
        policy.ensure(target);
    }

    public String name() {
        return errorKey;
    }
}
