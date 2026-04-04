package in.anusha.moneymanager.service;

import in.anusha.moneymanager.dto.IncomeDTO;
import in.anusha.moneymanager.entity.CategoryEntity;
import in.anusha.moneymanager.entity.IncomeEntity;
import in.anusha.moneymanager.entity.ProfileEntity;
import in.anusha.moneymanager.repository.CategoryRepository;
import in.anusha.moneymanager.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeService {
    private final CategoryRepository categoryRepository;
    private  final IncomeRepository incomeRepository;
    private  final ProfileService profileService;



    public IncomeDTO addIncome(IncomeDTO dto){
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(()-> new RuntimeException("Category not found"));
        IncomeEntity newIncome = toEntity(dto, profile, category);
        newIncome = incomeRepository.save(newIncome);
        return toDTO(newIncome);
    }

    public List<IncomeDTO> getCurrentMonthIncomesForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate now = LocalDate.now();
        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());
        List<IncomeEntity> list = incomeRepository.findByProfileIdAndDateBetween(profile.getId(), startDate,endDate);
        return  list.stream().map(this::toDTO).toList();
    }

    public void deleteIncome(Long expenseId){
        ProfileEntity profile = profileService.getCurrentProfile();
        IncomeEntity income = incomeRepository.findById(expenseId)
                .orElseThrow(()-> new RuntimeException("Income not found"));
        if(!income.getProfile().getId().equals(profile.getId())){
            throw new RuntimeException("Unauthorized to delete this income");
        }
        incomeRepository.deleteById(expenseId);
    }

    public List<IncomeDTO> getLatest5IncomesForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> list = incomeRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return  list.stream().map(this::toDTO).toList();
    }

    public BigDecimal getTotalIncomeForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        BigDecimal total = incomeRepository.findTotalExpensesByProfileId(profile.getId());
        return total != null ? total : BigDecimal.ZERO;
    }

    public List<IncomeDTO> filterIncomes(LocalDate startDate, LocalDate endDate, String keyword,Sort sort){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> list = incomeRepository.findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(
                profile.getId(),
                startDate,
                endDate,
                keyword,
                sort
        );
        return list.stream().map(this::toDTO).toList();
    }

    //helper methods for expense service will be added here
    private IncomeEntity toEntity(IncomeDTO dto, ProfileEntity profile, CategoryEntity category){
        return IncomeEntity.builder()
                .name(dto.getName())
                .icon(dto.getIcon())
                .amount(dto.getAmount())
                .date(dto.getDate())
                .profile(profile)
                .category(category)
                .build();
    }

    private IncomeDTO toDTO(IncomeEntity entity){
        return IncomeDTO.builder()
                .id(entity.getId())
                .name (entity.getName())
                .icon(entity.getIcon())
                .amount(entity.getAmount())
                .date(entity.getDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .categoryId(entity.getCategory()!=null?entity.getCategory().getId():null)
                .categoryName(entity.getCategory()!=null?entity.getCategory().getName():"N/A")
                .build();
    }

    public byte[] downloadIncomeDetails() {
        List<IncomeDTO> incomes = getCurrentMonthIncomesForCurrentUser();
        StringBuilder csvContent = new StringBuilder();
        csvContent.append("Date,Name,Category,Amount\n");
        for (IncomeDTO income : incomes) {
            csvContent.append(income.getDate()).append(",")
                    .append(income.getName()).append(",")
                    .append(income.getCategoryName()).append(",")
                    .append(income.getAmount()).append("\n");
        }
        return csvContent.toString().getBytes();
    }

    public IncomeDTO updateIncome(Long incomeId, IncomeDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        IncomeEntity income = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        if (!income.getProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("Unauthorized to update this income");
        }

        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        income.setName(dto.getName());
        income.setAmount(dto.getAmount());
        income.setDate(dto.getDate());
        income.setCategory(category);
        income.setIcon(dto.getIcon());

        IncomeEntity updatedIncome = incomeRepository.save(income);
        return toDTO(updatedIncome);
    }

    private final EmailService emailService;

    public void sendIncomeDetailsByEmail() {
        ProfileEntity profile = profileService.getCurrentProfile();
        String toEmail = profile.getEmail(); 
        
        if(toEmail == null || toEmail.isEmpty()){
             throw new RuntimeException("User email not found");
        }

        byte[] cvsData = downloadIncomeDetails();
        
        String subject = "Your Monthly Income Report";
        String body = "<h1>Income Report</h1><p>Please find attached your income details for the current month.</p>";
        
        emailService.sendEmailWithAttachment(toEmail, subject, body, cvsData, "income_details.csv");
    }
}
