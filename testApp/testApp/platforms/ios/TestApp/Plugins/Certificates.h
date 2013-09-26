//
//  Certificates.h
//  ClearConcert
//
//  Created by Andy Joslin on 3/15/13.
//
//

#import <Cordova/CDVPlugin.h>

@interface Certificates : CDVPlugin

- (void)setUntrusted:(CDVInvokedUrlCommand*)command;

@end
