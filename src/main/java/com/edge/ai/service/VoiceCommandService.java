package com.edge.ai.service;

import com.edge.ai.objects.VoiceCommandAnswer;
import com.edge.ai.objects.VoiceCommandQuery;

public interface VoiceCommandService {
	
	public VoiceCommandAnswer voiceListener(VoiceCommandQuery commandQuery);
	
}
