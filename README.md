# Cloudflare_logs

https://developers.cloudflare.com/logs/analytics-integrations/google-cloud

it push logs from cloudflare to gcp bucket, then with cloud function import to bigquery, and from data studio get this reports
![image](https://user-images.githubusercontent.com/46847735/110076547-ac167f80-7daa-11eb-8443-d50ca2dfcc16.png)

https://developers.cloudflare.com/logs/tutorials/bot-management-dashboard/


In Data Studio, open the Cloudflare template and click Use Template. A Create new report dialog opens.

1.Under the New Data Source dropdown, select Create New Data Source. A page opens where you can enter additional configuration details.
2.Under Google Connectors, locate the BigQuery card and click Select.
3.Next under MY PROJECTS, select your Project, Dataset, and Table.
4.Click Connect in the upper right.
