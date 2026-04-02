package com.rpgforge.application.policies;

@FunctionalInterface
public interface Policy<T> {

    void ensure(T target);
}
