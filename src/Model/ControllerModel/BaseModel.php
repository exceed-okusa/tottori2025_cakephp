<?php
namespace App\Model\ControllerModel;

use App\Controller\BaseController;
use App\Utils\DiffDdl\Replacer;
use App\Utils\Enum;
use App\Utils\Traits\SasLogTrait;
use Cake\Controller\Component;
use Cake\Controller\ComponentRegistry;

/**
 * Class BaseModel
 *
 * @property \App\Model\Table\AccountingSystemJournalAccountCodesTable $AccountingSystemJournalAccountCodes
 * @property \App\Model\Table\AccountingSystemsTable $AccountingSystems
 * @property \App\Model\Table\AnalyzeCustomerRankSettingsTable $AnalyzeCustomerRankSettings
 * @property \App\Model\Table\AnalyzeCustomersTable $AnalyzeCustomers
 * @property \App\Model\Table\AnalyzeStaffItemCategorySkillUseSalesTable $AnalyzeStaffItemCategorySkillUseSales
 * @property \App\Model\Table\AnalyzeStaffItemTypeSalesTable $AnalyzeStaffItemTypeSales
 * @property \App\Model\Table\AnalyzeStaffVisitsTable $AnalyzeStaffVisits
 * @property \App\Model\Table\AnalyzeStoreItemCategoryOperatingTimeSettingsTable $AnalyzeStoreItemCategoryOperatingTimeSettings
 * @property \App\Model\Table\AnalyzeStoreItemCategoryReservationsTable $AnalyzeStoreItemCategoryReservations
 * @property \App\Model\Table\AnalyzeStoreItemCategorySalesTable $AnalyzeStoreItemCategorySales
 * @property \App\Model\Table\AnalyzeStoreItemCategorySkillUseSalesTable $AnalyzeStoreItemCategorySkillUseSales
 * @property \App\Model\Table\AnalyzeStoreItemSalesTable $AnalyzeStoreItemSales
 * @property \App\Model\Table\AnalyzeStoreItemTypeSalesTable $AnalyzeStoreItemTypeSales
 * @property \App\Model\Table\AnalyzeStoreMediaCostsTable $AnalyzeStoreMediaCosts
 * @property \App\Model\Table\AnalyzeStoreMediaReservationsTable $AnalyzeStoreMediaReservations
 * @property \App\Model\Table\AnalyzeStoreMediaSalesTable $AnalyzeStoreMediaSales
 * @property \App\Model\Table\AnalyzeStoreMediaVisitsTable $AnalyzeStoreMediaVisits
 * @property \App\Model\Table\AnalyzeStorePurchaseCompanySalesTable $AnalyzeStorePurchaseCompanySales
 * @property \App\Model\Table\AnalyzeStoreReservationsTable $AnalyzeStoreReservations
 * @property \App\Model\Table\AnalyzeStoreSalesTable $AnalyzeStoreSales
 * @property \App\Model\Table\AnalyzeStoreSetItemSalesTable $AnalyzeStoreSetItemSales
 * @property \App\Model\Table\AnalyzeStoreSkillUseSalesTable $AnalyzeStoreSkillUseSales
 * @property \App\Model\Table\AnalyzeStoreVisitsTable $AnalyzeStoreVisits
 * @property \App\Model\Table\ApiCooperationSecurityCodesTable $ApiCooperationSecurityCodes
 * @property \App\Model\Table\AppBackButtonTasksTable $AppBackButtonTasks
 * @property \App\Model\Table\AppIntroImagesTable $AppIntroImages
 * @property \App\Model\Table\AppLogOperationsTable $AppLogOperations
 * @property \App\Model\Table\AppPushHistoriesTable $AppPushHistories
 * @property \App\Model\Table\AppStoreImagesTable $AppStoreImages
 * @property \App\Model\Table\AppStoreLinksTable $AppStoreLinks
 * @property \App\Model\Table\AppStoreNoticesTable $AppStoreNotices
 * @property \App\Model\Table\AppStoresTable $AppStores
 * @property \App\Model\Table\AppTalkCountsTable $AppTalkCounts
 * @property \App\Model\Table\AppTermsOfServicesTable $AppTermsOfServices
 * @property \App\Model\Table\AppUserHistoriesTable $AppUserHistories
 * @property \App\Model\Table\AppUserStoresTable $AppUserStores
 * @property \App\Model\Table\AppUsersTable $AppUsers
 * @property \App\Model\Table\AppsTable $Apps
 * @property \App\Model\Table\BackButtonTasksTable $BackButtonTasks
 * @property \App\Model\Table\BatHeadCompanyListsTable $BatHeadCompanyLists
 * @property \App\Model\Table\BatHistoriesTable $BatHistories
 * @property \App\Model\Table\BiotechCancelRequestSaleDetailAttributesTable $BiotechCancelRequestSaleDetailAttributes
 * @property \App\Model\Table\BiotechCardCompanySettingsTable $BiotechCardCompanySettings
 * @property \App\Model\Table\BiotechCompanyAddSettingsTable $BiotechCompanyAddSettings
 * @property \App\Model\Table\BiotechCorporationCardDisplaysTable $BiotechCorporationCardDisplays
 * @property \App\Model\Table\BiotechCorporationCardsTable $BiotechCorporationCards
 * @property \App\Model\Table\BiotechCounselorCheckMultiResultsTable $BiotechCounselorCheckMultiResults
 * @property \App\Model\Table\BiotechCounselorCheckResultsTable $BiotechCounselorCheckResults
 * @property \App\Model\Table\BiotechCourseSettingsTable $BiotechCourseSettings
 * @property \App\Model\Table\BiotechCustomerAttributesTable $BiotechCustomerAttributes
 * @property \App\Model\Table\BiotechCustomerChartDetailFilesTable $BiotechCustomerChartDetailFiles
 * @property \App\Model\Table\BiotechCustomerChartDetailsTable $BiotechCustomerChartDetails
 * @property \App\Model\Table\BiotechCustomerInfoChangeHistoriesTable $BiotechCustomerInfoChangeHistories
 * @property \App\Model\Table\BiotechCustomerSalesCourseHistoriesTable $BiotechCustomerSalesCourseHistories
 * @property \App\Model\Table\BiotechCustomerSalesLimitReleaseHistoriesTable $BiotechCustomerSalesLimitReleaseHistories
 * @property \App\Model\Table\BiotechElectronicMoneyCompanySettingsTable $BiotechElectronicMoneyCompanySettings
 * @property \App\Model\Table\BiotechFeeSettingsTable $BiotechFeeSettings
 * @property \App\Model\Table\BiotechGoodsSettingsTable $BiotechGoodsSettings
 * @property \App\Model\Table\BiotechHearingCounselorCheckAnswersTable $BiotechHearingCounselorCheckAnswers
 * @property \App\Model\Table\BiotechHearingCounselorCheckFilesTable $BiotechHearingCounselorCheckFiles
 * @property \App\Model\Table\BiotechHearingCounselorCheckQuestionGroupsTable $BiotechHearingCounselorCheckQuestionGroups
 * @property \App\Model\Table\BiotechHearingCounselorCheckQuestionsTable $BiotechHearingCounselorCheckQuestions
 * @property \App\Model\Table\BiotechHearingCounselorCheckResultsTable $BiotechHearingCounselorCheckResults
 * @property \App\Model\Table\BiotechHearingCounselorChecksTable $BiotechHearingCounselorChecks
 * @property \App\Model\Table\BiotechInOutStockDetailAttributesTable $BiotechInOutStockDetailAttributes
 * @property \App\Model\Table\BiotechInitiationFeeSettingsTable $BiotechInitiationFeeSettings
 * @property \App\Model\Table\BiotechInquiriesTable $BiotechInquiries
 * @property \App\Model\Table\BiotechJournalAccountRemarkAttributesTable $BiotechJournalAccountRemarkAttributes
 * @property \App\Model\Table\BiotechJournalAccountsTable $BiotechJournalAccounts
 * @property \App\Model\Table\BiotechMonthlySaleCourseAccountInformationHistoriesTable $BiotechMonthlySaleCourseAccountInformationHistories
 * @property \App\Model\Table\BiotechMonthlySaleCourseAccountInformationReportsTable $BiotechMonthlySaleCourseAccountInformationReports
 * @property \App\Model\Table\BiotechMonthlySaleCourseAccountInformationsTable $BiotechMonthlySaleCourseAccountInformations
 * @property \App\Model\Table\BiotechMonthlySaleCourseInformationHistoriesTable $BiotechMonthlySaleCourseInformationHistories
 * @property \App\Model\Table\BiotechMonthlySaleCourseInformationReportsTable $BiotechMonthlySaleCourseInformationReports
 * @property \App\Model\Table\BiotechMonthlySaleCourseInformationsTable $BiotechMonthlySaleCourseInformations
 * @property \App\Model\Table\BiotechMonthlySaleCourseWithdrawalResultDetailsTable $BiotechMonthlySaleCourseWithdrawalResultDetails
 * @property \App\Model\Table\BiotechMonthlySaleCourseWithdrawalResultsTable $BiotechMonthlySaleCourseWithdrawalResults
 * @property \App\Model\Table\BiotechNameItemClassesTable $BiotechNameItemClasses
 * @property \App\Model\Table\BiotechNameItemsTable $BiotechNameItems
 * @property \App\Model\Table\BiotechOrderDetailAttributesTable $BiotechOrderDetailAttributes
 * @property \App\Model\Table\BiotechOriginalSupportDiscountsTable $BiotechOriginalSupportDiscounts
 * @property \App\Model\Table\BiotechPaymentTypesTable $BiotechPaymentTypes
 * @property \App\Model\Table\BiotechPurchaseAttributesTable $BiotechPurchaseAttributes
 * @property \App\Model\Table\BiotechReceiptJournalCashSaleDetailAttributesTable $BiotechReceiptJournalCashSaleDetailAttributes
 * @property \App\Model\Table\BiotechReceiptJournalOtherSaleDetailAttributesTable $BiotechReceiptJournalOtherSaleDetailAttributes
 * @property \App\Model\Table\BiotechReceiveMoneyDetailAttributesTable $BiotechReceiveMoneyDetailAttributes
 * @property \App\Model\Table\BiotechReportGroupsTable $BiotechReportGroups
 * @property \App\Model\Table\BiotechReportMenusTable $BiotechReportMenus
 * @property \App\Model\Table\BiotechReservationAdditionsTable $BiotechReservationAdditions
 * @property \App\Model\Table\BiotechReservationColorSettingsTable $BiotechReservationColorSettings
 * @property \App\Model\Table\BiotechReservationColorSettingsTrialMenusTable $BiotechReservationColorSettingsTrialMenus
 * @property \App\Model\Table\BiotechSaleAttributesTable $BiotechSaleAttributes
 * @property \App\Model\Table\BiotechSaleContentPrintHistoriesTable $BiotechSaleContentPrintHistories
 * @property \App\Model\Table\BiotechSaleContentPrintHistoryDetailsTable $BiotechSaleContentPrintHistoryDetails
 * @property \App\Model\Table\BiotechSaleContentPrintHistoryReceiveMoneyDetailsTable $BiotechSaleContentPrintHistoryReceiveMoneyDetails
 * @property \App\Model\Table\BiotechSaleDetailAttributesTable $BiotechSaleDetailAttributes
 * @property \App\Model\Table\BiotechSaleEstimatePrintHistoriesTable $BiotechSaleEstimatePrintHistories
 * @property \App\Model\Table\BiotechSaleEstimatePrintHistoryDetailsTable $BiotechSaleEstimatePrintHistoryDetails
 * @property \App\Model\Table\BiotechSaleEstimatesTable $BiotechSaleEstimates
 * @property \App\Model\Table\BiotechSaleTypesTable $BiotechSaleTypes
 * @property \App\Model\Table\BiotechSalesCourseEntitiesTable $BiotechSalesCourseEntities
 * @property \App\Model\Table\BiotechSalesCoursesTable $BiotechSalesCourses
 * @property \App\Model\Table\BiotechSalesGoodsEntitiesTable $BiotechSalesGoodsEntities
 * @property \App\Model\Table\BiotechSalesInitiationFeeEntitiesTable $BiotechSalesInitiationFeeEntities
 * @property \App\Model\Table\BiotechSkillUseDetailAttributesTable $BiotechSkillUseDetailAttributes
 * @property \App\Model\Table\BiotechStaffSettingsTable $BiotechStaffSettings
 * @property \App\Model\Table\BiotechStatusReportHairBulbDetailsTable $BiotechStatusReportHairBulbDetails
 * @property \App\Model\Table\BiotechStatusReportMiltiResultsTable $BiotechStatusReportMiltiResults
 * @property \App\Model\Table\BiotechStatusReportsTable $BiotechStatusReports
 * @property \App\Model\Table\BiotechStoreAddSettingsTable $BiotechStoreAddSettings
 * @property \App\Model\Table\BiotechTemporaryCustomerAttributesTable $BiotechTemporaryCustomerAttributes
 * @property \App\Model\Table\BiotechTemporaryInOutStockDetailsTable $BiotechTemporaryInOutStockDetails
 * @property \App\Model\Table\BiotechTemporaryOrderDetailsTable $BiotechTemporaryOrderDetails
 * @property \App\Model\Table\BiotechTemporaryPurchaseDetailsTable $BiotechTemporaryPurchaseDetails
 * @property \App\Model\Table\BiotechTrialExperienceReportsTable $BiotechTrialExperienceReports
 * @property \App\Model\Table\BiotechUniqueNumbersTable $BiotechUniqueNumbers
 * @property \App\Model\Table\CalendarsTable $Calendars
 * @property \App\Model\Table\CancelReAssignmentsTable $CancelReAssignments
 * @property \App\Model\Table\CancelRequestAgreementHistoriesTable $CancelRequestAgreementHistories
 * @property \App\Model\Table\CancelRequestAgreementReceiveMoneyDetailHistoriesTable $CancelRequestAgreementReceiveMoneyDetailHistories
 * @property \App\Model\Table\CancelRequestReceiveMoneyDetailsTable $CancelRequestReceiveMoneyDetails
 * @property \App\Model\Table\CancelRequestReceiveMoneysTable $CancelRequestReceiveMoneys
 * @property \App\Model\Table\CancelRequestSaleDetailsTable $CancelRequestSaleDetails
 * @property \App\Model\Table\CancelRequestsTable $CancelRequests
 * @property \App\Model\Table\CardCompaniesTable $CardCompanies
 * @property \App\Model\Table\CardCompanyDisplaysTable $CardCompanyDisplays
 * @property \App\Model\Table\CardCompanyLoanSettingDetailsTable $CardCompanyLoanSettingDetails
 * @property \App\Model\Table\CardCompanyLoanSettingsTable $CardCompanyLoanSettings
 * @property \App\Model\Table\CardReceiveMoneyHistoriesTable $CardReceiveMoneyHistories
 * @property \App\Model\Table\CardReceiveMoneyHistoryStoreChangesTable $CardReceiveMoneyHistoryStoreChanges
 * @property \App\Model\Table\ChangeSqlListsTable $ChangeSqlLists
 * @property \App\Model\Table\ChangedSqlListsTable $ChangedSqlLists
 * @property \App\Model\Table\CloudFunctionsTable $CloudFunctions
 * @property \App\Model\Table\CompaniesTable $Companies
 * @property \App\Model\Table\CompanyCreditCardsTable $CompanyCreditCards
 * @property \App\Model\Table\CompanySystemSettingsTable $CompanySystemSettings
 * @property \App\Model\Table\CooperationLogsTable $CooperationLogs
 * @property \App\Model\Table\CooperationSecurityCodesTable $CooperationSecurityCodes
 * @property \App\Model\Table\CooperationSiteCustomersTable $CooperationSiteCustomers
 * @property \App\Model\Table\CooperationSiteSettingsTable $CooperationSiteSettings
 * @property \App\Model\Table\CounselingAnswersTable $CounselingAnswers
 * @property \App\Model\Table\CounselingDisplaysTable $CounselingDisplays
 * @property \App\Model\Table\CounselingQuestionDisplaysTable $CounselingQuestionDisplays
 * @property \App\Model\Table\CounselingQuestionsTable $CounselingQuestions
 * @property \App\Model\Table\CounselingStaffsTable $CounselingStaffs
 * @property \App\Model\Table\CounselingsTable $Counselings
 * @property \App\Model\Table\CourseDisplaysTable $CourseDisplays
 * @property \App\Model\Table\CourseGeneralPurposeItemClassesTable $CourseGeneralPurposeItemClasses
 * @property \App\Model\Table\CourseGeneralValuesTable $CourseGeneralValues
 * @property \App\Model\Table\CourseLargeGroupDisplaysTable $CourseLargeGroupDisplays
 * @property \App\Model\Table\CourseLargeGroupsTable $CourseLargeGroups
 * @property \App\Model\Table\CourseMiddleGroupDisplaysTable $CourseMiddleGroupDisplays
 * @property \App\Model\Table\CourseMiddleGroupsTable $CourseMiddleGroups
 * @property \App\Model\Table\CoursePricesTable $CoursePrices
 * @property \App\Model\Table\CourseStaffsTable $CourseStaffs
 * @property \App\Model\Table\CourseTimeExtensionDetailsTable $CourseTimeExtensionDetails
 * @property \App\Model\Table\CourseTotalPricesTable $CourseTotalPrices
 * @property \App\Model\Table\CourseWarrantyHistoriesTable $CourseWarrantyHistories
 * @property \App\Model\Table\CourseWarrantyHistoryDetailsTable $CourseWarrantyHistoryDetails
 * @property \App\Model\Table\CourseWarrantyMemoTemplatesTable $CourseWarrantyMemoTemplates
 * @property \App\Model\Table\CourseWarrantyOperativeHistoryDetailsTable $CourseWarrantyOperativeHistoryDetails
 * @property \App\Model\Table\CoursesTable $Courses
 * @property \App\Model\Table\CreatePlanListsTable $CreatePlanLists
 * @property \App\Model\Table\CsvImportHistoriesTable $CsvImportHistories
 * @property \App\Model\Table\CtiDisplayListHistoriesTable $CtiDisplayListHistories
 * @property \App\Model\Table\CtiDisplayListsTable $CtiDisplayLists
 * @property \App\Model\Table\CtiHistoriesTable $CtiHistories
 * @property \App\Model\Table\CtiItemsTable $CtiItems
 * @property \App\Model\Table\CustomExportMenusTable $CustomExportMenus
 * @property \App\Model\Table\CustomMenuFunctionsTable $CustomMenuFunctions
 * @property \App\Model\Table\CustomerBankAccountsTable $CustomerBankAccounts
 * @property \App\Model\Table\CustomerChartDetailsTable $CustomerChartDetails
 * @property \App\Model\Table\CustomerChartGroupDisplaysTable $CustomerChartGroupDisplays
 * @property \App\Model\Table\CustomerChartGroupsTable $CustomerChartGroups
 * @property \App\Model\Table\CustomerChartHandWritingTemplateDisplaysTable $CustomerChartHandWritingTemplateDisplays
 * @property \App\Model\Table\CustomerChartHandWritingTemplatesTable $CustomerChartHandWritingTemplates
 * @property \App\Model\Table\CustomerChartImagesTable $CustomerChartImages
 * @property \App\Model\Table\CustomerChartMemoFixedPhrasesTable $CustomerChartMemoFixedPhrases
 * @property \App\Model\Table\CustomerChartMemosTable $CustomerChartMemos
 * @property \App\Model\Table\CustomerChartsTable $CustomerCharts
 * @property \App\Model\Table\CustomerCodeChangeRequestDetailsTable $CustomerCodeChangeRequestDetails
 * @property \App\Model\Table\CustomerCodeChangeRequestsTable $CustomerCodeChangeRequests
 * @property \App\Model\Table\CustomerCodeHistoriesTable $CustomerCodeHistories
 * @property \App\Model\Table\CustomerCodeHistoryDetailsTable $CustomerCodeHistoryDetails
 * @property \App\Model\Table\CustomerComingCauseDisplaysTable $CustomerComingCauseDisplays
 * @property \App\Model\Table\CustomerComingCausesTable $CustomerComingCauses
 * @property \App\Model\Table\CustomerComingCyclesTable $CustomerComingCycles
 * @property \App\Model\Table\CustomerCompanyCreditCardsTable $CustomerCompanyCreditCards
 * @property \App\Model\Table\CustomerCounselingResultsTable $CustomerCounselingResults
 * @property \App\Model\Table\CustomerDiscountRankDisplaysTable $CustomerDiscountRankDisplays
 * @property \App\Model\Table\CustomerDiscountRankSettingDetailsTable $CustomerDiscountRankSettingDetails
 * @property \App\Model\Table\CustomerDiscountRankSettingsTable $CustomerDiscountRankSettings
 * @property \App\Model\Table\CustomerDiscountRanksTable $CustomerDiscountRanks
 * @property \App\Model\Table\CustomerDmHistoriesTable $CustomerDmHistories
 * @property \App\Model\Table\CustomerEmailsTable $CustomerEmails
 * @property \App\Model\Table\CustomerEnqueteResultsTable $CustomerEnqueteResults
 * @property \App\Model\Table\CustomerErrorEmailsTable $CustomerErrorEmails
 * @property \App\Model\Table\CustomerExtractConditionsTable $CustomerExtractConditions
 * @property \App\Model\Table\CustomerExtractMenusTable $CustomerExtractMenus
 * @property \App\Model\Table\CustomerGeneralValuesTable $CustomerGeneralValues
 * @property \App\Model\Table\CustomerGenerationsTable $CustomerGenerations
 * @property \App\Model\Table\CustomerInfoDisplaysTable $CustomerInfoDisplays
 * @property \App\Model\Table\CustomerListDetailsTable $CustomerListDetails
 * @property \App\Model\Table\CustomerListDmHistoriesTable $CustomerListDmHistories
 * @property \App\Model\Table\CustomerListsTable $CustomerLists
 * @property \App\Model\Table\CustomerMemorialDaysTable $CustomerMemorialDays
 * @property \App\Model\Table\CustomerPhonesTable $CustomerPhones
 * @property \App\Model\Table\CustomerPointHistoriesTable $CustomerPointHistories
 * @property \App\Model\Table\CustomerPointRankDisplaysTable $CustomerPointRankDisplays
 * @property \App\Model\Table\CustomerPointRankSettingDetailsTable $CustomerPointRankSettingDetails
 * @property \App\Model\Table\CustomerPointRankSettingsTable $CustomerPointRankSettings
 * @property \App\Model\Table\CustomerPointRanksTable $CustomerPointRanks
 * @property \App\Model\Table\CustomerRankApplicationDetailsTable $CustomerRankApplicationDetails
 * @property \App\Model\Table\CustomerRankApplicationsTable $CustomerRankApplications
 * @property \App\Model\Table\CustomerRankDisplaysTable $CustomerRankDisplays
 * @property \App\Model\Table\CustomerRankSettingsTable $CustomerRankSettings
 * @property \App\Model\Table\CustomerRanksTable $CustomerRanks
 * @property \App\Model\Table\CustomerReferrerHistoriesTable $CustomerReferrerHistories
 * @property \App\Model\Table\CustomerStaffHistoriesTable $CustomerStaffHistories
 * @property \App\Model\Table\CustomerStoreChangesTable $CustomerStoreChanges
 * @property \App\Model\Table\CustomerTableListsTable $CustomerTableLists
 * @property \App\Model\Table\CustomerVisitResultsTable $CustomerVisitResults
 * @property \App\Model\Table\CustomersTable $Customers
 * @property \App\Model\Table\DisabledFunctionsTable $DisabledFunctions
 * @property \App\Model\Table\DiscountDisplaysTable $DiscountDisplays
 * @property \App\Model\Table\DiscountLargeGroupDisplaysTable $DiscountLargeGroupDisplays
 * @property \App\Model\Table\DiscountLargeGroupsTable $DiscountLargeGroups
 * @property \App\Model\Table\DiscountMiddleGroupDisplaysTable $DiscountMiddleGroupDisplays
 * @property \App\Model\Table\DiscountMiddleGroupsTable $DiscountMiddleGroups
 * @property \App\Model\Table\DiscountSettingsTable $DiscountSettings
 * @property \App\Model\Table\DiscountsTable $Discounts
 * @property \App\Model\Table\DisplayItemsTable $DisplayItems
 * @property \App\Model\Table\DisplayMessagesTable $DisplayMessages
 * @property \App\Model\Table\DmAppDeliverTasksTable $DmAppDeliverTasks
 * @property \App\Model\Table\DmBeautyMeritDeliverTasksTable $DmBeautyMeritDeliverTasks
 * @property \App\Model\Table\DmCouponDisplaysTable $DmCouponDisplays
 * @property \App\Model\Table\DmCouponImageTemplateRowsTable $DmCouponImageTemplateRows
 * @property \App\Model\Table\DmCouponSnapsTable $DmCouponSnaps
 * @property \App\Model\Table\DmCouponTemplateDisplaysTable $DmCouponTemplateDisplays
 * @property \App\Model\Table\DmCouponTemplatesTable $DmCouponTemplates
 * @property \App\Model\Table\DmCouponsTable $DmCoupons
 * @property \App\Model\Table\DmEmailDeliverTasksTable $DmEmailDeliverTasks
 * @property \App\Model\Table\DmTemplateDisplaysTable $DmTemplateDisplays
 * @property \App\Model\Table\DmTemplatesTable $DmTemplates
 * @property \App\Model\Table\DocumentDetailsTable $DocumentDetails
 * @property \App\Model\Table\DocumentHoldersTable $DocumentHolders
 * @property \App\Model\Table\DocumentTypesTable $DocumentTypes
 * @property \App\Model\Table\DocumentsTable $Documents
 * @property \App\Model\Table\DuplicateCustomerAlertDetailsTable $DuplicateCustomerAlertDetails
 * @property \App\Model\Table\DuplicateCustomerAlertsTable $DuplicateCustomerAlerts
 * @property \App\Model\Table\ElectronicMoneyCompaniesTable $ElectronicMoneyCompanies
 * @property \App\Model\Table\ElectronicMoneyCompanyDisplaysTable $ElectronicMoneyCompanyDisplays
 * @property \App\Model\Table\EnqueteAnswersTable $EnqueteAnswers
 * @property \App\Model\Table\EnqueteQuestionDisplaysTable $EnqueteQuestionDisplays
 * @property \App\Model\Table\EnqueteQuestionsTable $EnqueteQuestions
 * @property \App\Model\Table\ExpirationProcessHistoriesTable $ExpirationProcessHistories
 * @property \App\Model\Table\FeesTable $Fees
 * @property \App\Model\Table\FreeCustomerDmHistoriesTable $FreeCustomerDmHistories
 * @property \App\Model\Table\GeneralPurposeItemClassesTable $GeneralPurposeItemClasses
 * @property \App\Model\Table\GeneralPurposeItemDisplaysTable $GeneralPurposeItemDisplays
 * @property \App\Model\Table\GeneralPurposeItemsTable $GeneralPurposeItems
 * @property \App\Model\Table\GiftTicketDisplaysTable $GiftTicketDisplays
 * @property \App\Model\Table\GiftTicketsTable $GiftTickets
 * @property \App\Model\Table\GoodsDisplaysTable $GoodsDisplays
 * @property \App\Model\Table\GoodsGeneralPurposeItemClassesTable $GoodsGeneralPurposeItemClasses
 * @property \App\Model\Table\GoodsLargeGroupDisplaysTable $GoodsLargeGroupDisplays
 * @property \App\Model\Table\GoodsLargeGroupsTable $GoodsLargeGroups
 * @property \App\Model\Table\GoodsMiddleGroupDisplaysTable $GoodsMiddleGroupDisplays
 * @property \App\Model\Table\GoodsMiddleGroupsTable $GoodsMiddleGroups
 * @property \App\Model\Table\GoodsPricesTable $GoodsPrices
 * @property \App\Model\Table\GoodsStaffsTable $GoodsStaffs
 * @property \App\Model\Table\GoodsStockSettingsTable $GoodsStockSettings
 * @property \App\Model\Table\GoodsTable $Goods
 * @property \App\Model\Table\HeadCompaniesTable $HeadCompanies
 * @property \App\Model\Table\HolidaysTable $Holidays
 * @property \App\Model\Table\ImportLogsTable $ImportLogs
 * @property \App\Model\Table\InOutStockDetailsTable $InOutStockDetails
 * @property \App\Model\Table\InOutStocksTable $InOutStocks
 * @property \App\Model\Table\InitiationFeeDisplaysTable $InitiationFeeDisplays
 * @property \App\Model\Table\InitiationFeeLargeGroupDisplaysTable $InitiationFeeLargeGroupDisplays
 * @property \App\Model\Table\InitiationFeeLargeGroupsTable $InitiationFeeLargeGroups
 * @property \App\Model\Table\InitiationFeeMiddleGroupDisplaysTable $InitiationFeeMiddleGroupDisplays
 * @property \App\Model\Table\InitiationFeeMiddleGroupsTable $InitiationFeeMiddleGroups
 * @property \App\Model\Table\InitiationFeePricesTable $InitiationFeePrices
 * @property \App\Model\Table\InitiationFeeTypeDetailsTable $InitiationFeeTypeDetails
 * @property \App\Model\Table\InitiationFeeTypesTable $InitiationFeeTypes
 * @property \App\Model\Table\InitiationFeesTable $InitiationFees
 * @property \App\Model\Table\IosDevicesTable $IosDevices
 * @property \App\Model\Table\ItemCategoriesTable $ItemCategories
 * @property \App\Model\Table\ItemCategoryDisplaysTable $ItemCategoryDisplays
 * @property \App\Model\Table\ItemCategoryEntitiesTable $ItemCategoryEntities
 * @property \App\Model\Table\ItemCodeChangeRequestDetailsTable $ItemCodeChangeRequestDetails
 * @property \App\Model\Table\ItemCodeChangeRequestsTable $ItemCodeChangeRequests
 * @property \App\Model\Table\ItemCodeHistoriesTable $ItemCodeHistories
 * @property \App\Model\Table\ItemCodeHistoryDetailsTable $ItemCodeHistoryDetails
 * @property \App\Model\Table\ItemTableListsTable $ItemTableLists
 * @property \App\Model\Table\JasperCountersTable $JasperCounters
 * @property \App\Model\Table\JobDisplaysTable $JobDisplays
 * @property \App\Model\Table\JobsTable $Jobs
 * @property \App\Model\Table\JournalAccountRemarkDisplaysTable $JournalAccountRemarkDisplays
 * @property \App\Model\Table\JournalAccountRemarksTable $JournalAccountRemarks
 * @property \App\Model\Table\JournalAccountsTable $JournalAccounts
 * @property \App\Model\Table\LedgerSheetJobHistoriesTable $LedgerSheetJobHistories
 * @property \App\Model\Table\LedgerSheetJobListsTable $LedgerSheetJobLists
 * @property \App\Model\Table\LevelAuthorityFunctionsTable $LevelAuthorityFunctions
 * @property \App\Model\Table\LogOperationsTable $LogOperations
 * @property \App\Model\Table\LogPersonalInfosTable $LogPersonalInfos
 * @property \App\Model\Table\MailSendHistoriesTable $MailSendHistories
 * @property \App\Model\Table\MediaDisplaysTable $MediaDisplays
 * @property \App\Model\Table\MediaGroupDisplaysTable $MediaGroupDisplays
 * @property \App\Model\Table\MediaGroupsTable $MediaGroups
 * @property \App\Model\Table\MediasTable $Medias
 * @property \App\Model\Table\MenuFunctionsTable $MenuFunctions
 * @property \App\Model\Table\MenuSettingsTable $MenuSettings
 * @property \App\Model\Table\MoneyCalculateSettingHistoriesTable $MoneyCalculateSettingHistories
 * @property \App\Model\Table\MoneyCalculateSettingsTable $MoneyCalculateSettings
 * @property \App\Model\Table\MoneyTypesTable $MoneyTypes
 * @property \App\Model\Table\NameItemClassesTable $NameItemClasses
 * @property \App\Model\Table\NameItemsTable $NameItems
 * @property \App\Model\Table\NoticeFromSecretariatAttachmentsTable $NoticeFromSecretariatAttachments
 * @property \App\Model\Table\NoticeFromSecretariatDeliverTargetsTable $NoticeFromSecretariatDeliverTargets
 * @property \App\Model\Table\NoticeFromSecretariatResultsTable $NoticeFromSecretariatResults
 * @property \App\Model\Table\NoticeFromSecretariatsTable $NoticeFromSecretariats
 * @property \App\Model\Table\OrderDetailsTable $OrderDetails
 * @property \App\Model\Table\OrdersTable $Orders
 * @property \App\Model\Table\OtherCustomerMailHistoriesTable $OtherCustomerMailHistories
 * @property \App\Model\Table\PersonalInformationAgreementsTable $PersonalInformationAgreements
 * @property \App\Model\Table\PlanCustomersTable $PlanCustomers
 * @property \App\Model\Table\PlanRoomsTable $PlanRooms
 * @property \App\Model\Table\PlanStaffPatternDetailsTable $PlanStaffPatternDetails
 * @property \App\Model\Table\PlanStaffPatternsTable $PlanStaffPatterns
 * @property \App\Model\Table\PlanStaffsTable $PlanStaffs
 * @property \App\Model\Table\PlanStorePatternDetailsTable $PlanStorePatternDetails
 * @property \App\Model\Table\PlanStorePatternsTable $PlanStorePatterns
 * @property \App\Model\Table\PlanTemplatesTable $PlanTemplates
 * @property \App\Model\Table\PlansTable $Plans
 * @property \App\Model\Table\PointSettingsTable $PointSettings
 * @property \App\Model\Table\PostalsTable $Postals
 * @property \App\Model\Table\PurchaseCompaniesTable $PurchaseCompanies
 * @property \App\Model\Table\PurchaseCompanyDisplaysTable $PurchaseCompanyDisplays
 * @property \App\Model\Table\PurchaseDetailsTable $PurchaseDetails
 * @property \App\Model\Table\PurchasesTable $Purchases
 * @property \App\Model\Table\PushNotificationDevicesTable $PushNotificationDevices
 * @property \App\Model\Table\Ra01001SettingsTable $Ra01001Settings
 * @property \App\Model\Table\ReceiptJournalCostDetailDividesTable $ReceiptJournalCostDetailDivides
 * @property \App\Model\Table\ReceiptJournalCostDetailsTable $ReceiptJournalCostDetails
 * @property \App\Model\Table\ReceiptJournalSaleDetailsTable $ReceiptJournalSaleDetails
 * @property \App\Model\Table\ReceiptsPrintHistoriesTable $ReceiptsPrintHistories
 * @property \App\Model\Table\ReceiveMoneyDetailInputsTable $ReceiveMoneyDetailInputs
 * @property \App\Model\Table\ReceiveMoneyDetailStoreChangesTable $ReceiveMoneyDetailStoreChanges
 * @property \App\Model\Table\ReceiveMoneyDetailsTable $ReceiveMoneyDetails
 * @property \App\Model\Table\ReceiveMoneyInputsTable $ReceiveMoneyInputs
 * @property \App\Model\Table\ReceiveMoneysTable $ReceiveMoneys
 * @property \App\Model\Table\ReportLogOperationsTable $ReportLogOperations
 * @property \App\Model\Table\ReportRankingStaffsSettingsTable $ReportRankingStaffsSettings
 * @property \App\Model\Table\ReportRankingStoresSettingsTable $ReportRankingStoresSettings
 * @property \App\Model\Table\ReservationColorSettingsTable $ReservationColorSettings
 * @property \App\Model\Table\ReservationDetailHistoriesTable $ReservationDetailHistories
 * @property \App\Model\Table\ReservationDetailsTable $ReservationDetails
 * @property \App\Model\Table\ReservationGeneralPurposeDetailsTable $ReservationGeneralPurposeDetails
 * @property \App\Model\Table\ReservationGeneralPurposeItemClassesTable $ReservationGeneralPurposeItemClasses
 * @property \App\Model\Table\ReservationGeneralPurposeItemsTable $ReservationGeneralPurposeItems
 * @property \App\Model\Table\ReservationHistoriesTable $ReservationHistories
 * @property \App\Model\Table\ReservationHistoryGeneralPurposeDetailsTable $ReservationHistoryGeneralPurposeDetails
 * @property \App\Model\Table\ReservationMemosTable $ReservationMemos
 * @property \App\Model\Table\ReservationMonthlyResultCountsTable $ReservationMonthlyResultCounts
 * @property \App\Model\Table\ReservationsTable $Reservations
 * @property \App\Model\Table\RinxCustomerAddReceiveDataViewsTable $RinxCustomerAddReceiveDataViews
 * @property \App\Model\Table\RoomTypeDisplaysTable $RoomTypeDisplays
 * @property \App\Model\Table\RoomTypeEntitiesTable $RoomTypeEntities
 * @property \App\Model\Table\RoomTypesTable $RoomTypes
 * @property \App\Model\Table\RoomsTable $Rooms
 * @property \App\Model\Table\SaleBulkTaxRatesTable $SaleBulkTaxRates
 * @property \App\Model\Table\SaleChangeRequestAgreementAfterHistoriesTable $SaleChangeRequestAgreementAfterHistories
 * @property \App\Model\Table\SaleChangeRequestAgreementBeforeHistoriesTable $SaleChangeRequestAgreementBeforeHistories
 * @property \App\Model\Table\SaleChangeRequestAgreementHistoriesTable $SaleChangeRequestAgreementHistories
 * @property \App\Model\Table\SaleChangeRequestDetailsTable $SaleChangeRequestDetails
 * @property \App\Model\Table\SaleChangeRequestsTable $SaleChangeRequests
 * @property \App\Model\Table\SaleDetailBulkTaxesTable $SaleDetailBulkTaxes
 * @property \App\Model\Table\SaleDetailGeneralValuesTable $SaleDetailGeneralValues
 * @property \App\Model\Table\SaleDetailInputGeneralValuesTable $SaleDetailInputGeneralValues
 * @property \App\Model\Table\SaleDetailInputsTable $SaleDetailInputs
 * @property \App\Model\Table\SaleDetailStoreChangesTable $SaleDetailStoreChanges
 * @property \App\Model\Table\SaleDetailsTable $SaleDetails
 * @property \App\Model\Table\SaleEntitiesTable $SaleEntities
 * @property \App\Model\Table\SaleEstimateBulkTaxRatesTable $SaleEstimateBulkTaxRates
 * @property \App\Model\Table\SaleEstimateDetailBulkTaxesTable $SaleEstimateDetailBulkTaxes
 * @property \App\Model\Table\SaleEstimateDetailGeneralValuesTable $SaleEstimateDetailGeneralValues
 * @property \App\Model\Table\SaleEstimateDetailsTable $SaleEstimateDetails
 * @property \App\Model\Table\SaleEstimatePrintHistoriesTable $SaleEstimatePrintHistories
 * @property \App\Model\Table\SaleEstimatePrintHistoryDetailsTable $SaleEstimatePrintHistoryDetails
 * @property \App\Model\Table\SaleEstimatePrintHistoryReceiveMoneyDetailsTable $SaleEstimatePrintHistoryReceiveMoneyDetails
 * @property \App\Model\Table\SaleEstimateReceiveMoneyDetailsTable $SaleEstimateReceiveMoneyDetails
 * @property \App\Model\Table\SaleEstimatesTable $SaleEstimates
 * @property \App\Model\Table\SaleInputsTable $SaleInputs
 * @property \App\Model\Table\SaleReceiptPrintHistoriesTable $SaleReceiptPrintHistories
 * @property \App\Model\Table\SaleReceiptPrintHistoryDetailsTable $SaleReceiptPrintHistoryDetails
 * @property \App\Model\Table\SaleReceiptPrintHistoryReceiveMoneyDetailsTable $SaleReceiptPrintHistoryReceiveMoneyDetails
 * @property \App\Model\Table\SaleStoreChangesTable $SaleStoreChanges
 * @property \App\Model\Table\SalesPrintHistoriesTable $SalesPrintHistories
 * @property \App\Model\Table\SalesPrintHistoryDetailsTable $SalesPrintHistoryDetails
 * @property \App\Model\Table\SalesPrintHistoryReceiveMoneyDetailsTable $SalesPrintHistoryReceiveMoneyDetails
 * @property \App\Model\Table\SalesPromotionAutoDeliverHistoriesTable $SalesPromotionAutoDeliverHistories
 * @property \App\Model\Table\SalesPromotionAutoDeliverSettingsTable $SalesPromotionAutoDeliverSettings
 * @property \App\Model\Table\SalesTable $Sales
 * @property \App\Model\Table\ScheduleStaffPatternDetailsTable $ScheduleStaffPatternDetails
 * @property \App\Model\Table\ScheduleStaffPatternsTable $ScheduleStaffPatterns
 * @property \App\Model\Table\ScheduleStaffSettingsTable $ScheduleStaffSettings
 * @property \App\Model\Table\ScheduleStaffsTable $ScheduleStaffs
 * @property \App\Model\Table\ScheduleStorePatternDetailsTable $ScheduleStorePatternDetails
 * @property \App\Model\Table\ScheduleStorePatternsTable $ScheduleStorePatterns
 * @property \App\Model\Table\ScheduleStoresTable $ScheduleStores
 * @property \App\Model\Table\ServiceSkillCountHistoriesTable $ServiceSkillCountHistories
 * @property \App\Model\Table\SessionsTable $Sessions
 * @property \App\Model\Table\SetItemDetailsTable $SetItemDetails
 * @property \App\Model\Table\SetItemDisplaysTable $SetItemDisplays
 * @property \App\Model\Table\SetItemsTable $SetItems
 * @property \App\Model\Table\ShellExecLogsTable $ShellExecLogs
 * @property \App\Model\Table\ShellExecSettingsTable $ShellExecSettings
 * @property \App\Model\Table\SkillUseDetailStoreChangesTable $SkillUseDetailStoreChanges
 * @property \App\Model\Table\SkillUseDetailsTable $SkillUseDetails
 * @property \App\Model\Table\SlowQueryExclusionListsTable $SlowQueryExclusionLists
 * @property \App\Model\Table\StaffBelongToStoreHistoriesTable $StaffBelongToStoreHistories
 * @property \App\Model\Table\StaffCodeChangeRequestDetailsTable $StaffCodeChangeRequestDetails
 * @property \App\Model\Table\StaffCodeChangeRequestsTable $StaffCodeChangeRequests
 * @property \App\Model\Table\StaffCodeHistoriesTable $StaffCodeHistories
 * @property \App\Model\Table\StaffCodeHistoryDetailsTable $StaffCodeHistoryDetails
 * @property \App\Model\Table\StaffDisplaysTable $StaffDisplays
 * @property \App\Model\Table\StaffMonthlyPlannedSaleCustomersTable $StaffMonthlyPlannedSaleCustomers
 * @property \App\Model\Table\StaffMonthlyPlannedSalesTable $StaffMonthlyPlannedSales
 * @property \App\Model\Table\StaffMonthlySaleResultCountsTable $StaffMonthlySaleResultCounts
 * @property \App\Model\Table\StaffMonthlySaleResultsCustomersTable $StaffMonthlySaleResultsCustomers
 * @property \App\Model\Table\StaffMonthlySaleResultsTable $StaffMonthlySaleResults
 * @property \App\Model\Table\StaffMonthlySkillUseResultsTable $StaffMonthlySkillUseResults
 * @property \App\Model\Table\StaffPlannedSaleInputsTable $StaffPlannedSaleInputs
 * @property \App\Model\Table\StaffPlannedSalesTable $StaffPlannedSales
 * @property \App\Model\Table\StaffSaleFluctuationsTable $StaffSaleFluctuations
 * @property \App\Model\Table\StaffSalesTargetsTable $StaffSalesTargets
 * @property \App\Model\Table\StaffSkillUseFluctuationsTable $StaffSkillUseFluctuations
 * @property \App\Model\Table\StaffTableListsTable $StaffTableLists
 * @property \App\Model\Table\StaffTeamsTable $StaffTeams
 * @property \App\Model\Table\StaffsTable $Staffs
 * @property \App\Model\Table\StoreAttributesTable $StoreAttributes
 * @property \App\Model\Table\StoreGroupBelongsTable $StoreGroupBelongs
 * @property \App\Model\Table\StoreGroupsTable $StoreGroups
 * @property \App\Model\Table\StoreMonthlyCancelRestResultsTable $StoreMonthlyCancelRestResults
 * @property \App\Model\Table\StoreMonthlyPlannedReceiveMoneysTable $StoreMonthlyPlannedReceiveMoneys
 * @property \App\Model\Table\StoreMonthlyPlannedSalesTable $StoreMonthlyPlannedSales
 * @property \App\Model\Table\StoreMonthlySaleResultCountsTable $StoreMonthlySaleResultCounts
 * @property \App\Model\Table\StoreMonthlySaleResultsTable $StoreMonthlySaleResults
 * @property \App\Model\Table\StoreMonthlySaleTypeResultCountsTable $StoreMonthlySaleTypeResultCounts
 * @property \App\Model\Table\StoreMonthlySkillUseResultsTable $StoreMonthlySkillUseResults
 * @property \App\Model\Table\StoreMonthlyStocksTable $StoreMonthlyStocks
 * @property \App\Model\Table\StoreMonthlyTotalResultsTable $StoreMonthlyTotalResults
 * @property \App\Model\Table\StoreOpenUsersTable $StoreOpenUsers
 * @property \App\Model\Table\StorePlannedSaleInputsTable $StorePlannedSaleInputs
 * @property \App\Model\Table\StorePlannedSalesTable $StorePlannedSales
 * @property \App\Model\Table\StoreReceiptOutputItemsTable $StoreReceiptOutputItems
 * @property \App\Model\Table\StoreSaleFluctuationsTable $StoreSaleFluctuations
 * @property \App\Model\Table\StoreSalesTargetsTable $StoreSalesTargets
 * @property \App\Model\Table\StoreSkillUseFluctuationsTable $StoreSkillUseFluctuations
 * @property \App\Model\Table\StoreSystemSettingsTable $StoreSystemSettings
 * @property \App\Model\Table\StoresTable $Stores
 * @property \App\Model\Table\StreetLightTreatmentPartTimesTable $StreetLightTreatmentPartTimes
 * @property \App\Model\Table\SuppliesPrintHistoriesTable $SuppliesPrintHistories
 * @property \App\Model\Table\SuppliesPrintHistoryDetailsTable $SuppliesPrintHistoryDetails
 * @property \App\Model\Table\SuppliesPrintHistoryReceiveMoneyDetailsTable $SuppliesPrintHistoryReceiveMoneyDetails
 * @property \App\Model\Table\SuppliesTable $Supplies
 * @property \App\Model\Table\SupplyDetailsTable $SupplyDetails
 * @property \App\Model\Table\SystemErrorMailAddressesTable $SystemErrorMailAddresses
 * @property \App\Model\Table\SystemMessagesTable $SystemMessages
 * @property \App\Model\Table\SystemTaxSettingsTable $SystemTaxSettings
 * @property \App\Model\Table\SystemTermsServicesTable $SystemTermsServices
 * @property \App\Model\Table\TakeStockDetailsTable $TakeStockDetails
 * @property \App\Model\Table\TakeStocksTable $TakeStocks
 * @property \App\Model\Table\TargetReceiveMoneyIdsTable $TargetReceiveMoneyIds
 * @property \App\Model\Table\TemporaryCardReceiveMoneyHistoriesTable $TemporaryCardReceiveMoneyHistories
 * @property \App\Model\Table\TemporaryCardReceiveMoneyHistoryErrorListsTable $TemporaryCardReceiveMoneyHistoryErrorLists
 * @property \App\Model\Table\TemporaryConditionsTable $TemporaryConditions
 * @property \App\Model\Table\TemporaryCustomersTable $TemporaryCustomers
 * @property \App\Model\Table\TemporaryExtractCustomersTable $TemporaryExtractCustomers
 * @property \App\Model\Table\TemporaryInOutStockDetailsTable $TemporaryInOutStockDetails
 * @property \App\Model\Table\TemporaryOrderDetailsTable $TemporaryOrderDetails
 * @property \App\Model\Table\TemporaryPurchaseDetailsTable $TemporaryPurchaseDetails
 * @property \App\Model\Table\TemporaryReceiveMovedStoreItemDetailsTable $TemporaryReceiveMovedStoreItemDetails
 * @property \App\Model\Table\TemporaryReportRankingStaffsSettingsTable $TemporaryReportRankingStaffsSettings
 * @property \App\Model\Table\TemporaryTakeStocksTable $TemporaryTakeStocks
 * @property \App\Model\Table\TightenStoreDayHistoriesTable $TightenStoreDayHistories
 * @property \App\Model\Table\TightenStoreDaysTable $TightenStoreDays
 * @property \App\Model\Table\TightenStoreMonthsTable $TightenStoreMonths
 * @property \App\Model\Table\TreatmentContraindicationAgreementsTable $TreatmentContraindicationAgreements
 * @property \App\Model\Table\TreatmentDetailPrintHistoriesTable $TreatmentDetailPrintHistories
 * @property \App\Model\Table\TreatmentDetailPrintHistoryDetailsTable $TreatmentDetailPrintHistoryDetails
 * @property \App\Model\Table\TreatmentDetailPrintItemDisplaysTable $TreatmentDetailPrintItemDisplays
 * @property \App\Model\Table\TreatmentDetailsTable $TreatmentDetails
 * @property \App\Model\Table\UnShippedSuppliesPrintHistoriesTable $UnShippedSuppliesPrintHistories
 * @property \App\Model\Table\UnShippedSupplyDetailsPrintHistoriesTable $UnShippedSupplyDetailsPrintHistories
 * @property \App\Model\Table\UniqueNumbersTable $UniqueNumbers
 * @property \App\Model\Table\UserAuthoritiesTable $UserAuthorities
 * @property \App\Model\Table\UserReferableCompaniesTable $UserReferableCompanies
 * @property \App\Model\Table\UserReferableStoresTable $UserReferableStores
 * @property \App\Model\Table\UserRegistrationLimitSettingsTable $UserRegistrationLimitSettings
 * @property \App\Model\Table\UserSystemSettingsTable $UserSystemSettings
 * @property \App\Model\Table\UsersTable $Users
 * @property \App\Model\Table\WarehousesTable $Warehouses
 * @property \App\Model\Table\WebAffiliatesTable $WebAffiliates
 * @property \App\Model\Table\WebAppMessageTemplatesTable $WebAppMessageTemplates
 * @property \App\Model\Table\WebCustomerDmHistoriesTable $WebCustomerDmHistories
 * @property \App\Model\Table\WebCustomerMailRequestsTable $WebCustomerMailRequests
 * @property \App\Model\Table\WebCustomersTable $WebCustomers
 * @property \App\Model\Table\WebEnqueteQuestionDisplaysTable $WebEnqueteQuestionDisplays
 * @property \App\Model\Table\WebFreeReservationNominationSettingsTable $WebFreeReservationNominationSettings
 * @property \App\Model\Table\WebInformationsTable $WebInformations
 * @property \App\Model\Table\WebLogOperationsTable $WebLogOperations
 * @property \App\Model\Table\WebMailSendHistoriesTable $WebMailSendHistories
 * @property \App\Model\Table\WebMailTemplatesTable $WebMailTemplates
 * @property \App\Model\Table\WebMenuGroupDisplaysTable $WebMenuGroupDisplays
 * @property \App\Model\Table\WebMenuGroupRelationsTable $WebMenuGroupRelations
 * @property \App\Model\Table\WebMenuGroupsTable $WebMenuGroups
 * @property \App\Model\Table\WebMenuSameTimeRefuseItemsTable $WebMenuSameTimeRefuseItems
 * @property \App\Model\Table\WebMenusTable $WebMenus
 * @property \App\Model\Table\WebPreReservationDetailsTable $WebPreReservationDetails
 * @property \App\Model\Table\WebPreReservationsTable $WebPreReservations
 * @property \App\Model\Table\WebReservationHistoriesTable $WebReservationHistories
 * @property \App\Model\Table\WebReservationQuestionDisplaysTable $WebReservationQuestionDisplays
 * @property \App\Model\Table\WebReviewDetailsTable $WebReviewDetails
 * @property \App\Model\Table\WebReviewQuestionDisplaysTable $WebReviewQuestionDisplays
 * @property \App\Model\Table\WebReviewQuestionsTable $WebReviewQuestions
 * @property \App\Model\Table\WebReviewsTable $WebReviews
 * @property \App\Model\Table\WebRoomsTable $WebRooms
 * @property \App\Model\Table\WebStaffProfileQuestionDisplaysTable $WebStaffProfileQuestionDisplays
 * @property \App\Model\Table\WebStaffProfileQuestionsTable $WebStaffProfileQuestions
 * @property \App\Model\Table\WebStaffProfilesTable $WebStaffProfiles
 * @property \App\Model\Table\WebStaffsTable $WebStaffs
 * @property \App\Model\Table\WebStoresTable $WebStores
 * @property \App\Model\Table\WebUnsubscribeQuestionnaireAnswersTable $WebUnsubscribeQuestionnaireAnswers
 * @property \App\Model\Table\WebUnsubscribeQuestionnaireQuestionDisplaysTable $WebUnsubscribeQuestionnaireQuestionDisplays
 * @property \App\Model\Table\WebUnsubscribeQuestionnaireQuestionsTable $WebUnsubscribeQuestionnaireQuestions
 * @property \App\Model\Table\WebUnsubscribeQuestionnairesTable $WebUnsubscribeQuestionnaires
 * @property \App\Model\Table\WorkShiftPatternDetailsTable $WorkShiftPatternDetails
 * @property \App\Model\Table\WorkShiftPatternsTable $WorkShiftPatterns
 * @property \App\Model\Table\WorkShiftSettingsTable $WorkShiftSettings
 * @property \App\Model\Table\WorkShiftStaffDailyResultsTable $WorkShiftStaffDailyResults
 * @property \App\Model\Table\WorkShiftStaffSettingsTable $WorkShiftStaffSettings
 * @property \App\Model\Table\WorkShiftStaffsTable $WorkShiftStaffs
 * @property \App\Model\Table\WorkShiftStampHistoriesTable $WorkShiftStampHistories
 * @property \App\Model\Table\WorkShiftsTable $WorkShifts
 * @property \App\Model\Table\_SampleTable $_Sample
 *
 * @property \App\Controller\Component\AWSS3Component $AWSS3
 * @property \App\Controller\Component\AWSSESComponent $AWSSES
 * @property \App\Controller\Component\AgreementHeaderComponent $AgreementHeader
 * @property \App\Controller\Component\AppBackButtonComponent $AppBackButton
 * @property \App\Controller\Component\AppContainComponent $AppContain
 * @property \App\Controller\Component\AssociateExceedBaseServiceComponent $AssociateExceedBaseService
 * @property \App\Controller\Component\AssociateOtherExceedServiceComponent $AssociateOtherExceedService
 * @property \App\Controller\Component\BackButtonComponent $BackButton
 * @property \App\Controller\Component\BackUpComponent $BackUp
 * @property \App\Controller\Component\BiotechApiComponent $BiotechApi
 * @property \App\Controller\Component\BiotechCommonComponent $BiotechCommon
 * @property \App\Controller\Component\BiotechReportMenusGetFormComponent $BiotechReportMenusGetForm
 * @property \App\Controller\Component\CheckMovePageComponent $CheckMovePage
 * @property \App\Controller\Component\ClosingDateComponent $ClosingDate
 * @property \App\Controller\Component\CommonAuthorityComponent $CommonAuthority
 * @property \App\Controller\Component\CommonComponent $Common
 * @property \App\Controller\Component\CommonDocumentComponent $CommonDocument
 * @property \App\Controller\Component\CommonItemsComponent $CommonItems
 * @property \App\Controller\Component\CommonSkillUseComponent $CommonSkillUse
 * @property \App\Controller\Component\CommonWorkShiftComponent $CommonWorkShift
 * @property \App\Controller\Component\CustomerEditComponent $CustomerEdit
 * @property \App\Controller\Component\CustomerExtractComponent $CustomerExtract
 * @property \App\Controller\Component\CustomerHeaderComponent $CustomerHeader
 * @property \App\Controller\Component\CustomerReferrerComponent $CustomerReferrer
 * @property \App\Controller\Component\CustomerSelectorComponent $CustomerSelector
 * @property \App\Controller\Component\DynamoDbComponent $DynamoDb
 * @property \App\Controller\Component\EditCardCompanyComponent $EditCardCompany
 * @property \App\Controller\Component\EditDisplaysComponent $EditDisplays
 * @property \App\Controller\Component\FormatRowBiotechSalesViewComponent $FormatRowBiotechSalesView
 * @property \App\Controller\Component\FormatRowReservationEditComponent $FormatRowReservationEdit
 * @property \App\Controller\Component\FormatRowSalesViewCourseInitiationFeeComponent $FormatRowSalesViewCourseInitiationFee
 * @property \App\Controller\Component\FormatRowSalesViewGoodsTicketComponent $FormatRowSalesViewGoodsTicket
 * @property \App\Controller\Component\FormatRowSetItemEditComponent $FormatRowSetItemEdit
 * @property \App\Controller\Component\ImageComponent $Image
 * @property \App\Controller\Component\InitDataComponent $InitData
 * @property \App\Controller\Component\IntegrationCustomersComponent $IntegrationCustomers
 * @property \App\Controller\Component\LoginComponent $Login
 * @property \App\Controller\Component\MemcachedComponent $Memcached
 * @property \App\Controller\Component\PushComponent $Push
 * @property \App\Controller\Component\ReceiptComponent $Receipt
 * @property \App\Controller\Component\ReferableComponent $Referable
 * @property \App\Controller\Component\ReportJournalComponent $ReportJournal
 * @property \App\Controller\Component\ReportServiceComponent $ReportService
 * @property \App\Controller\Component\ReportSummaryRfmComponent $ReportSummaryRfm
 * @property \App\Controller\Component\ReportUserSuppliesComponent $ReportUserSupplies
 * @property \App\Controller\Component\ReservationsCommonComponent $ReservationsCommon
 * @property \App\Controller\Component\ReserveAppComponent $ReserveApp
 * @property \App\Controller\Component\ReserveCommonComponent $ReserveCommon
 * @property \App\Controller\Component\ReserveCustomerComponent $ReserveCustomer
 * @property \App\Controller\Component\ReserveHistoryComponent $ReserveHistory
 * @property \App\Controller\Component\ReserveMailComponent $ReserveMail
 * @property \App\Controller\Component\ReserveMenuComponent $ReserveMenu
 * @property \App\Controller\Component\ReservePointComponent $ReservePoint
 * @property \App\Controller\Component\ReserveQuestionnaireComponent $ReserveQuestionnaire
 * @property \App\Controller\Component\ReserveSessionComponent $ReserveSession
 * @property \App\Controller\Component\ReserveStaffComponent $ReserveStaff
 * @property \App\Controller\Component\ReserveUrlComponent $ReserveUrl
 * @property \App\Controller\Component\SaveCourseWarrantyComponent $SaveCourseWarranty
 * @property \App\Controller\Component\SavePlannedSaleComponent $SavePlannedSale
 * @property \App\Controller\Component\SaveRinxPrintHistoryComponent $SaveRinxPrintHistory
 * @property \App\Controller\Component\SaveSaleFluctuationComponent $SaveSaleFluctuation
 * @property \App\Controller\Component\SearchComponent $Search
 * @property \App\Controller\Component\SetOptionMenuComponent $SetOptionMenu
 * @property \App\Controller\Component\SlipCheckComponent $SlipCheck
 * @property \App\Controller\Component\SlipConditionStringComponent $SlipConditionString
 * @property \App\Controller\Component\SlipStatusComponent $SlipStatus
 * @property \App\Controller\Component\StockComponent $Stock
 * @property \App\Controller\Component\SwitchUrlComponent $SwitchUrl
 * @property \App\Controller\Component\TemporaryCustomerHeaderComponent $TemporaryCustomerHeader
 * @property \App\Controller\Component\TogetherComponent $Together
 * @property \App\Controller\Component\TreeComponent $Tree
 * @property \App\Controller\Component\UniqueNumberCodeComponent $UniqueNumberCode
 * @property \App\Controller\Component\VarPhpJsComponent $VarPhpJs
 * @property \App\Controller\Component\VisitResultComponent $VisitResult
 *
 * @property \Cake\Controller\Component\AuthComponent $Auth
 * @property \Cake\Controller\Component\CookieComponent $Cookie
 * @property \Cake\Controller\Component\CsrfComponent $Csrf
 * @property \Cake\Controller\Component\FlashComponent $Flash
 * @property \Cake\Controller\Component\PaginatorComponent $Paginator
 * @property \Cake\Controller\Component\RequestHandlerComponent $RequestHandler
 * @property \Cake\Controller\Component\SecurityComponent $Security
 *
 * @property string $dbNameDefault
 * @property string $dbNameHcTemplate
 * @property string $dbNameHc
 * @property string $dbNameApp
 * @property \App\Model\Entity\User $loginUser
 * @property integer $targetHeadCompanyId
 * @property integer $targetCompanyId
 * @property integer $targetStoreId
 * @property \Cake\I18n\FrozenDate $targetDate
 * @property integer $posOpenFlag
 * @property array $referableStoreIds
 * @property Enum $Enum
 * @property \App\Utils\BaseConnection $connection
 * @property \App\Shell\BaseShell $shell
 * @property \App\Utils\SystemCompany $systemCompany
 * @property \App\Utils\SystemStore $systemStore
 * @property \App\Utils\SystemUser $systemUser
 * @property string $systemEnvironmentType
 * @property bool $isFromIOs
 *
 * @property BaseController $controller
 * @property array $params
 */
class BaseModel
{
    use SasLogTrait;

    /**
     * BaseModel constructor.
     * @param BaseController $controller
     * @param $params
     * @throws \Exception
     */
    public function __construct(BaseController $controller, $params)
    {
        // エスケープ！
        // １次元の配列までは考慮。
        foreach ($params as $key => &$param) {
            if (is_array($param)) {
                foreach ($param as &$param_) {
                    $param_ = $this->escapeParam($param_, $key, $params);
                }
                unset($param_);
            } else {
                $param = $this->escapeParam($param, $key, $params);
            }
        }
        unset($param);

        $this->params = $params;
        $this->controller = $controller;
    }

    /**
     * @param $param
     * @param $key
     * @param $params
     * @return string
     * @throws \Exception
     */
    private function escapeParam($param, $key, $params)
    {
        if (!is_string($param) && !is_int($param) && !is_bool($param) && !is_null($param)) {
            $this->logWarning(compact('key', 'param', 'params'));
            throw new \Exception(_mes('XXX', '想定外の型のパラメータが渡っています。'));
        }

        // インジェクション対策
        $param = str_replace("\\", "\\\\", $param);
        $param = str_replace("'", "\\'", $param);

        // 日付はハイフン区切りでないとインデックスが効かない場合があるため、置き換え
        if (preg_match('/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/', $param)) {
            $param = str_replace('/', '-', $param);
        }

        return $param;
    }

    public function __get($name)
    {
        return $this->controller->$name;
    }

    public function __isset($name)
    {
        return isset($this->controller->$name);
    }

    public function setHCConnection($headCompanyId)
    {
        $this->controller->setHCConnection($headCompanyId);
    }

    /**
     * @param array $queries
     * @param bool $slowQueryExclusionFlag
     * @param string $fetchType
     * @return array
     * @throws \Exception
     */
    public function execute($queries, $slowQueryExclusionFlag = false, $fetchType = 'assoc')
    {
        $data = [];

        $slowQueryExclusionListId = null;
        if ($slowQueryExclusionFlag) {
            $slowQueryExclusionListId = $this->SlowQueryExclusionLists->start();
        }

        if ($this->connection->currentIsAll()) {
            $this->connection->query("USE {$this->controller->getDbName('hc')}");
        }

        try {
            $count = count($queries);
            $i = 0;
            foreach ($queries as $query) {
                $i++;
                if ($i !== $count) {
                    $this->executeMultiQuery($query);
                } else {
                    // 最後のひとつ
                    $data = $this->connection->query($query)->fetchAll($fetchType);
                    $this->SlowQueryExclusionLists->end($slowQueryExclusionListId);
                }
            }
        } catch( \Exception $exception ) {
            $errorFile = LOGS. 'error_mysql_'. (new \DateTime())->format('YmdHis'). '.log';
            file_put_contents($errorFile, print_r(implode("\r\n", $queries), true));

            // 古いログを削除
            $count = 0;
            foreach (array_reverse(glob(LOGS. '*.log')) as $path) {
                $filename = str_replace(LOGS, '', $path);
                if (preg_match('/error_mysql_[0-9]{14}\.log/', $filename) === 1) {
                    $count ++;
                    if ($count > 5) {  // 最大 5 件まで
                        unlink($path);
                    }
                }
            }

            $this->logWarning([
                'query' => $errorFile,
                'params' => $this->params,
            ]);
            throw $exception;
        }

        if ($this->connection->currentIsAll()) {
            $this->connection->query("USE {$this->controller->getDbName('all_schema')}");
        }

        return $data;
    }

    /**
     * @param $query
     * @throws \Exception
     */
    private function executeMultiQuery($query) {
        $quotationReplacer = new Replacer("'", "'", "\\'");
        $query = $quotationReplacer->replace($query);
        $arrayQueries = explode(';', $query);

        try {
            foreach ($arrayQueries as $i => $query) {
                if (!preg_match('/[a-zA-Z0-9]{1}/', $query)) {
                    continue;
                }
                $query = $quotationReplacer->restore($query);
                $this->connection->query($query);
            }
        } catch( \Exception $e ) {
            throw new \Exception( ($i+1). "番目のクエリ：". $e->getMessage(). "\r\n". $query );
        }
    }
}
