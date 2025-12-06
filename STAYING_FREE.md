# How to Stay Free (Zero Cost)

To ensure you are not charged, we must keep your usage within the **Google Cloud Free Tier**.

## 1. Automated Limits (I have done this)
I have updated your `apphosting.yaml` with the following strict limits:

- **`minInstances: 0`**: This "Scale to Zero" feature is the most important. It means when no one is visiting your site, your "server" turns off completely. You pay nothing ($0) when it is off.
- **`maxInstances: 1`**: This ensures that even if you go viral or get attacked by bots, Google will NOT spin up 100 servers to handle the load. It will cap at 1, keeping your potential costs very low (or free).
- **`cpu: 1` & `memoryMiB: 512`**: Using the smallest powerful configuration to consume fewer "billable seconds".

## 2. Limits You Must Watch (Manual)
The code settings above protect against *server* costs, but there are other quotas:

### Cloud Run (Hosting)
- **Free Tier**: 180,000 vCPU-seconds per month.
- **What this means**: With 1 CPU instance running, you have about **50 hours** of active usage per month for free. Since it scales to zero, unless you have constant traffic 24/7, you will likely stay free.

### Cloud Build (Building the site)
- **Free Tier**: 120 build-minutes per day.
- **Recommendation**: Don't push code 50 times a day. A few deploys a day is totally fine and free.

### Sanity (Content)
- You are on the Sanity Free Tier.
- **Limits**: Generous allowances for bandwidth and API requests.
- **Alert**: Sanity will warn you if you approach limits, but usually won't auto-charge unless you entered a credit card *and* upgraded the plan manually.

## 3. Vital Safety Step: Budget Alerts
You generally cannot "hard cap" costs to $0.00 at the platform level (services might stop, but storage pennies might accrue). The best protection is a **Budget Alert**.

1.  Go to [Google Cloud Billing Budgets](https://console.cloud.google.com/billing/budgets).
2.  Click **Create Budget**.
3.  Set "Target amount" to **$1.00** (or $0.50).
4.  Set "Actions" to **email you** if 50% ($0.50) is reached.

**Why?** If something creates a tiny charge, you get an email immediately, and you can shut things down before it becomes $10 or $100.
