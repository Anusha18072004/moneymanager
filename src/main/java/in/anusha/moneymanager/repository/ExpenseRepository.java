package in.anusha.moneymanager.repository;

import in.anusha.moneymanager.entity.ExpenseEntiity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<ExpenseEntiity,Long> {

     List<ExpenseEntiity>findByProfileIdOrderByDateDesc(Long profileId);
     List<ExpenseEntiity>findTop5ByProfileIdOrderByDateDesc(Long profileId);

     @Query("SELECT SUM(e.amount) FROM ExpenseEntiity e WHERE e.profile.id = :profileId")
     BigDecimal findTotalExpensesByProfileId(@Param("profileId") Long profileId);

     List<ExpenseEntiity>findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
             Long profileId,
             LocalDate startDate,
             LocalDate endDate,
             String keyword,
            Sort sort
     );

     List<ExpenseEntiity>findByProfileIdAndDateBetween(Long profileId, LocalDate startDate, LocalDate endDate);

     List<ExpenseEntiity> findByProfileIdAndDate(Long profileId, LocalDate date);
}
