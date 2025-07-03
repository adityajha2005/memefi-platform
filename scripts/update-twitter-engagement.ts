import { ethers } from 'ethers';
import { CONTRACTS, MemeStakingABI, TwitterEngagementABI } from '../contracts.config';
import 'dotenv/config';

// Configuration
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const UPDATE_INTERVAL = 2 * 60 * 60; // 2 hours in seconds
const MAX_RETRIES = 3;
const BATCH_SIZE = 10; // Number of memes to update in one batch

async function main() {
  if (!PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY environment variable is required');
  }

  // Connect to the network
  const provider = new ethers.JsonRpcProvider(CONTRACTS.NETWORK.rpcUrl);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // Initialize contracts
  const memeStaking = new ethers.Contract(
    CONTRACTS.MEME_STAKING,
    MemeStakingABI,
    wallet
  );

  const twitterEngagement = new ethers.Contract(
    CONTRACTS.TWITTER_ENGAGEMENT,
    TwitterEngagementABI,
    wallet
  );

  console.log('Starting Twitter engagement update script...');

  try {
    // Get total number of memes
    const nextMemeId = await memeStaking.nextMemeId();
    const totalMemes = Math.max(0, Number(nextMemeId) - 1);

    console.log(`Total memes found: ${totalMemes}`);

    // Process memes in batches
    for (let i = 1; i <= totalMemes; i += BATCH_SIZE) {
      const batchEnd = Math.min(i + BATCH_SIZE - 1, totalMemes);
      console.log(`\nProcessing batch: Memes ${i} to ${batchEnd}`);

      const memesToUpdate = [];
      
      // Check which memes in this batch need updates
      for (let memeId = i; memeId <= batchEnd; memeId++) {
        try {
          const meme = await memeStaking.memes(memeId);
          
          // Skip if meme doesn't exist or has no tweet ID
          if (!meme || !meme.exists || !meme.tweetId) {
            console.log(`Skipping Meme #${memeId}: Not found or no tweet ID`);
            continue;
          }

          // Add to update list if engagement score is 0 or it's time for an update
          const currentTime = Math.floor(Date.now() / 1000);
          const lastUpdateTime = Number(meme.timestamp);
          
          if (meme.engagementScore === 0 || currentTime - lastUpdateTime >= UPDATE_INTERVAL) {
            memesToUpdate.push({
              id: memeId,
              tweetId: meme.tweetId
            });
          }
        } catch (err) {
          console.error(`Error checking Meme #${memeId}:`, err);
        }
      }

      // Update engagement for selected memes
      for (const meme of memesToUpdate) {
        let success = false;
        let attempts = 0;

        while (!success && attempts < MAX_RETRIES) {
          try {
            console.log(`\nUpdating engagement for Meme #${meme.id} (Tweet ID: ${meme.tweetId})`);
            console.log(`Attempt ${attempts + 1} of ${MAX_RETRIES}`);

            const tx = await twitterEngagement.requestEngagementMetrics(meme.id, meme.tweetId);
            console.log('Transaction sent:', tx.hash);
            
            const receipt = await tx.wait();
            console.log('Transaction confirmed');
            
            success = true;
          } catch (err) {
            attempts++;
            console.error(`Attempt ${attempts} failed:`, err);
            
            if (attempts < MAX_RETRIES) {
              console.log('Retrying in 5 seconds...');
              await new Promise(resolve => setTimeout(resolve, 5000));
            }
          }
        }

        if (!success) {
          console.error(`Failed to update Meme #${meme.id} after ${MAX_RETRIES} attempts`);
        }

        // Wait between memes to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log('\nEngagement update process completed!');
  } catch (err) {
    console.error('Script failed:', err);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Unhandled error:', err);
    process.exit(1);
  }); 