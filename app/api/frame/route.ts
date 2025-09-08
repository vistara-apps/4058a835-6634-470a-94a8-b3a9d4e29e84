import { NextRequest, NextResponse } from 'next/server';
import { getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const { isValid, message } = await getFrameMessage(body, {
      neynarApiKey: process.env.NEYNAR_API_KEY,
    });

    if (!isValid) {
      return new NextResponse('Message not valid', { status: 500 });
    }

    const text = message.input || '';
    let state = {
      page: 0,
    };

    try {
      state = JSON.parse(decodeURIComponent(message.state?.serialized || ''));
    } catch (e) {
      console.error(e);
    }

    /**
     * Use this code to redirect to a different page
     */
    if (message?.button === 3) {
      return NextResponse.redirect(
        'https://www.google.com',
        { status: 302 },
      );
    }

    // Handle different button actions
    let frameContent = '';
    let buttons: any[] = [];

    switch (message?.button) {
      case 1: // Start Battle
        frameContent = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; font-family: Arial, sans-serif;">
            <div style="text-align: center; padding: 40px;">
              <h1 style="font-size: 48px; margin-bottom: 20px; background: linear-gradient(45deg, #00d4ff, #8000ff, #ff0080); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">⚔️ BATTLE ARENA ⚔️</h1>
              <p style="font-size: 24px; margin-bottom: 30px; color: #b0b0b0;">Choose your battle mode</p>
              <div style="display: flex; gap: 20px; justify-content: center;">
                <div style="background: rgba(0, 212, 255, 0.2); border: 2px solid #00d4ff; border-radius: 12px; padding: 20px; text-align: center;">
                  <div style="font-size: 32px; margin-bottom: 10px;">🤖</div>
                  <div style="font-size: 18px; font-weight: bold;">AI Battle</div>
                  <div style="font-size: 14px; color: #b0b0b0;">Practice Mode</div>
                </div>
                <div style="background: rgba(255, 0, 128, 0.2); border: 2px solid #ff0080; border-radius: 12px; padding: 20px; text-align: center;">
                  <div style="font-size: 32px; margin-bottom: 10px;">👥</div>
                  <div style="font-size: 18px; font-weight: bold;">PvP Battle</div>
                  <div style="font-size: 14px; color: #b0b0b0;">Ranked Mode</div>
                </div>
              </div>
            </div>
          </div>
        `;
        buttons = [
          { label: '🤖 Fight AI', action: 'post' },
          { label: '👥 Find Player', action: 'post' },
          { label: '🏠 Back to Lobby', action: 'post' },
        ];
        break;

      case 2: // View Leaderboard
        frameContent = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; font-family: Arial, sans-serif;">
            <div style="text-align: center; padding: 40px;">
              <h1 style="font-size: 48px; margin-bottom: 20px; background: linear-gradient(45deg, #ffd700, #ffb347); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🏆 LEADERBOARD 🏆</h1>
              <div style="background: rgba(255, 215, 0, 0.1); border: 2px solid #ffd700; border-radius: 12px; padding: 30px; margin: 20px 0;">
                <div style="display: flex; flex-direction: column; gap: 15px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255, 215, 0, 0.2); border-radius: 8px;">
                    <span style="font-size: 20px;">👑 #1 Champion</span>
                    <span style="font-size: 18px; color: #ffd700;">2,450 pts</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(192, 192, 192, 0.2); border-radius: 8px;">
                    <span style="font-size: 18px;">🥈 #2 Warrior</span>
                    <span style="font-size: 16px; color: #c0c0c0;">2,180 pts</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(205, 127, 50, 0.2); border-radius: 8px;">
                    <span style="font-size: 18px;">🥉 #3 Fighter</span>
                    <span style="font-size: 16px; color: #cd7f32;">1,920 pts</span>
                  </div>
                </div>
              </div>
              <p style="font-size: 16px; color: #b0b0b0;">Battle to climb the ranks!</p>
            </div>
          </div>
        `;
        buttons = [
          { label: '⚔️ Start Battle', action: 'post' },
          { label: '🎯 Battle Pass', action: 'post' },
          { label: '🏠 Back to Lobby', action: 'post' },
        ];
        break;

      case 3: // Battle Pass
        frameContent = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; font-family: Arial, sans-serif;">
            <div style="text-align: center; padding: 40px;">
              <h1 style="font-size: 48px; margin-bottom: 20px; background: linear-gradient(45deg, #ff6b35, #f7931e); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🎯 BATTLE PASS 🎯</h1>
              <div style="background: rgba(255, 107, 53, 0.1); border: 2px solid #ff6b35; border-radius: 12px; padding: 30px; margin: 20px 0;">
                <div style="margin-bottom: 20px;">
                  <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">Level 15</div>
                  <div style="background: rgba(0, 0, 0, 0.3); border-radius: 20px; height: 20px; width: 300px; margin: 0 auto; position: relative;">
                    <div style="background: linear-gradient(90deg, #ff6b35, #f7931e); border-radius: 20px; height: 100%; width: 75%;"></div>
                  </div>
                  <div style="font-size: 16px; color: #ff6b35; margin-top: 10px;">2,250 / 3,000 XP</div>
                </div>
                <div style="display: flex; gap: 20px; justify-content: center;">
                  <div style="text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 5px;">🎨</div>
                    <div style="font-size: 14px;">Rare Skin</div>
                  </div>
                  <div style="text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 5px;">💎</div>
                    <div style="font-size: 14px;">Premium NFT</div>
                  </div>
                  <div style="text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 5px;">⚡</div>
                    <div style="font-size: 14px;">Power Boost</div>
                  </div>
                </div>
              </div>
              <p style="font-size: 16px; color: #b0b0b0;">Win battles to unlock exclusive rewards!</p>
            </div>
          </div>
        `;
        buttons = [
          { label: '⚔️ Start Battle', action: 'post' },
          { label: '🏆 Leaderboard', action: 'post' },
          { label: '🏠 Back to Lobby', action: 'post' },
        ];
        break;

      default: // Main Lobby
        frameContent = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; font-family: Arial, sans-serif;">
            <div style="text-align: center; padding: 40px;">
              <h1 style="font-size: 56px; margin-bottom: 20px; background: linear-gradient(45deg, #00d4ff, #8000ff, #ff0080); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">⚔️ CRYPTO COMBAT ARENA ⚔️</h1>
              <p style="font-size: 24px; margin-bottom: 30px; color: #b0b0b0;">Master your NFT collection in real-time blockchain battles</p>
              <div style="display: flex; gap: 30px; justify-content: center; margin-bottom: 30px;">
                <div style="text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 10px;">🤖</div>
                  <div style="font-size: 18px; font-weight: bold;">AI Battles</div>
                  <div style="font-size: 14px; color: #b0b0b0;">Practice & Learn</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 10px;">👥</div>
                  <div style="font-size: 18px; font-weight: bold;">PvP Matches</div>
                  <div style="font-size: 14px; color: #b0b0b0;">Ranked Competition</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 10px;">🏆</div>
                  <div style="font-size: 18px; font-weight: bold;">Leaderboards</div>
                  <div style="font-size: 14px; color: #b0b0b0;">Climb the Ranks</div>
                </div>
              </div>
              <div style="background: rgba(0, 212, 255, 0.1); border: 2px solid #00d4ff; border-radius: 12px; padding: 20px; margin-top: 20px;">
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">🎯 Battle Pass Level 15</div>
                <div style="font-size: 16px; color: #00d4ff;">2,250 / 3,000 XP • Next: Rare NFT Skin</div>
              </div>
            </div>
          </div>
        `;
        buttons = [
          { label: '⚔️ Start Battle', action: 'post' },
          { label: '🏆 Leaderboard', action: 'post' },
          { label: '🎯 Battle Pass', action: 'post' },
          { label: '🌐 Open App', action: 'link', target: process.env.NEXT_PUBLIC_URL || 'https://crypto-combat-arena.vercel.app' },
        ];
        break;
    }

    return new NextResponse(
      getFrameHtmlResponse({
        buttons,
        image: {
          src: `data:image/svg+xml;base64,${Buffer.from(frameContent).toString('base64')}`,
          aspectRatio: '1.91:1',
        },
        postUrl: `${process.env.NEXT_PUBLIC_URL || 'https://crypto-combat-arena.vercel.app'}/api/frame`,
        state: {
          page: state?.page + 1,
        },
      }),
    );
  } catch (error) {
    console.error('Frame API error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(): Promise<Response> {
  // Initial frame for when someone shares the app
  const frameContent = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; font-family: Arial, sans-serif;">
      <div style="text-align: center; padding: 40px;">
        <h1 style="font-size: 56px; margin-bottom: 20px; background: linear-gradient(45deg, #00d4ff, #8000ff, #ff0080); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">⚔️ CRYPTO COMBAT ARENA ⚔️</h1>
        <p style="font-size: 24px; margin-bottom: 30px; color: #b0b0b0;">Master your NFT collection in real-time blockchain battles</p>
        <div style="display: flex; gap: 30px; justify-content: center; margin-bottom: 30px;">
          <div style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">🤖</div>
            <div style="font-size: 18px; font-weight: bold;">AI Battles</div>
            <div style="font-size: 14px; color: #b0b0b0;">Practice & Learn</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">👥</div>
            <div style="font-size: 18px; font-weight: bold;">PvP Matches</div>
            <div style="font-size: 14px; color: #b0b0b0;">Ranked Competition</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">🏆</div>
            <div style="font-size: 18px; font-weight: bold;">Leaderboards</div>
            <div style="font-size: 14px; color: #b0b0b0;">Climb the Ranks</div>
          </div>
        </div>
        <div style="background: rgba(0, 212, 255, 0.1); border: 2px solid #00d4ff; border-radius: 12px; padding: 20px; margin-top: 20px;">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">🎯 Ready to Battle?</div>
          <div style="font-size: 16px; color: #00d4ff;">Connect your wallet and start your journey!</div>
        </div>
      </div>
    </div>
  `;

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        { label: '⚔️ Start Battle', action: 'post' },
        { label: '🏆 Leaderboard', action: 'post' },
        { label: '🎯 Battle Pass', action: 'post' },
        { label: '🌐 Open App', action: 'link', target: process.env.NEXT_PUBLIC_URL || 'https://crypto-combat-arena.vercel.app' },
      ],
      image: {
        src: `data:image/svg+xml;base64,${Buffer.from(frameContent).toString('base64')}`,
        aspectRatio: '1.91:1',
      },
      postUrl: `${process.env.NEXT_PUBLIC_URL || 'https://crypto-combat-arena.vercel.app'}/api/frame`,
    }),
  );
}
