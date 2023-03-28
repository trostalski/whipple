from abc import ABC, abstractmethod


class BaseComparator(ABC):
    @abstractmethod
    def compare(self):
        ...

    @abstractmethod
    def _compare_pair(self):
        ...

    @abstractmethod
    def _compare_set(self) -> float:
        ...
