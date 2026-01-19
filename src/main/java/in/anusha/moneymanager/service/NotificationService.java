package in.anusha.moneymanager.service;

import in.anusha.moneymanager.dto.ExpenseDTO;
import in.anusha.moneymanager.entity.ProfileEntity;
import in.anusha.moneymanager.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final ProfileRepository profileRepository;
    private  final EmailService emailService;
    private  final ExpenseService expenseService;

    @Value("${money.manager.frontend.url}")
    private String frontendUrl;

   @Scheduled(cron = "0 0 22 * * *",zone = "IST")
    public void sendDailyIncomeExpenseReminder(){
        log.info("job started : sendDailyIncomeExpenseReminder()");
        List<ProfileEntity> profiles = profileRepository.findAll();
        for(ProfileEntity profile:profiles){
            String body =
                    "Hi " + profile.getFullName() + ",<br/><br/>"
                            + "This is a friendly reminder to add your income and expenses for today in <b>Money Manager</b><br/><br/>"
                            + "<a href='" + frontendUrl + "' "
                            + "style='display:inline-block;padding:10px 20px;"
                            + "background-color:#4CAF50;color:#fff;"
                            + "text-decoration:none;border-radius:5px;font-weight:bold;'>"
                            + "Go to Money Manager</a><br/><br/>"
                            + "Thank you for using our Money Manager App!<br/><br/>"
                            + "Best regards,<br/>"
                            + "Money Manager Team";

            emailService.sendEmail(profile.getEmail(),"Daily remainder:Add your income and expenses",body);
        }
       log.info("job completed : sendDailyIncomeExpenseReminder()");

   }

   //@Scheduled(cron = "0 * * * * *",zone = "IST")
   @Scheduled(cron = "0 0 23 * * *",zone = "IST")
    public void sendDailyExpenseSummary(){
       log.info("job started : sendDailyExpenseSummary()");
        List<ProfileEntity> profiles = profileRepository.findAll();
        for(ProfileEntity profile:profiles){
            List<ExpenseDTO> todaysExpenses = expenseService.getExpensesForUserOnDate(profile.getId(), LocalDate.now());
            if(!todaysExpenses.isEmpty()){
                StringBuilder table = new StringBuilder();
                table.append("<table style='border-collapse: collapse; width: 100%;'>")
                        .append("<tr>")
                        .append("<th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>S.No</th>")
                        .append("<th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>Name</th>")
                        .append("<th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>Amount</th>")
                        .append("<th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>Category</th>")
                        .append("</tr>");
                int i = 1;
                for(ExpenseDTO expense : todaysExpenses){
                    table.append("<tr>")
                            .append("<td style='border: 1px solid #ddd; padding: 8px;'>").append(i++).append("</td>")
                            .append("<td style='border: 1px solid #ddd; padding: 8px;'>").append(expense.getName()).append("</td>")
                            .append("<td style='border: 1px solid #ddd; padding: 8px;'>").append(expense.getAmount()).append("</td>")
                            .append("<td style='border: 1px solid #ddd; padding: 8px;'>").append(expense.getCategoryId() !=null?expense.getCategoryName():"Null").append("</td>")
                            .append("</tr>");
                }
                table.append("</table>");

                String body =
                        "Hi " + profile.getFullName() + ",<br/><br/>"
                                + "Here is the summary of your expenses for today in <b>Money Manager</b>:<br/><br/>"
                                + table.toString()
                                + "<br/>Thank you for using our Money Manager App!<br/><br/>"
                                + "Best regards,<br/>"
                                + "Money Manager Team";
                emailService.sendEmail(profile.getEmail(),"Daily Expense Summary",body);
            }
        }
        log.info("job Completed : sendDailyExpenseSummary()");

    }
}
